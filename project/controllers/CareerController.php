<?php
require_once __DIR__ . '/../utils/Logger.php';

class CareerController
{
    private $model;
    private $emailService;

    // Single source of truth for accepted position titles.
    // Only the clean TITLE goes here (no department, no dash suffix).
    private static $ALLOWED_POSITIONS = [
        'General Talent Pool',
        'ID & RFID Assembly Division Lead',
        'Precision CNC Router Operator',
        'Quality Control & Antenna Lead (RFID/NFC)',
        'Senior React & Canva Simulation Engineer',
        'Gotek Unified ERP Solutions Architect',
        'Orbit Core (SAC) Product Manager',
    ];

    public function __construct($model, $emailService)
    {
        $this->model        = $model;
        $this->emailService = $emailService;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Normalise an incoming position string so that it can be compared
    // against the allowed list regardless of:
    //   • department suffix  ("Title — Dept" or "Title - Dept")
    //   • dash character     (—, –, -, or -)
    //   • surrounding spaces
    //   • letter case
    // Returns lower-cased clean title only.
    // ─────────────────────────────────────────────────────────────────────────
    private static function normalise(string $raw): string
    {
        // 1. Decode any HTML entities that may have been encoded
        $s = html_entity_decode($raw, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // 2. Collapse all dash variants (em-dash, en-dash, hyphen) to a single ASCII hyphen
        $s = preg_replace('/[\x{2014}\x{2013}\x{002D}]+/u', '-', $s);

        // 3. Take only the part BEFORE the first hyphen (drops department)
        $parts = explode('-', $s, 2);
        $title = trim($parts[0]);

        // 4. Collapse multiple spaces
        $title = preg_replace('/\s+/', ' ', $title);

        // 5. Lower-case for comparison
        return mb_strtolower($title, 'UTF-8');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Find the official title that matches $incoming (fuzzy).
    // Returns the canonical title string, or null if no match.
    // ─────────────────────────────────────────────────────────────────────────
    private static function matchPosition(string $incoming): ?string
    {
        $normIncoming = self::normalise($incoming);

        foreach (self::$ALLOWED_POSITIONS as $official) {
            if (self::normalise($official) === $normIncoming) {
                return $official;  // return the canonical, clean version
            }
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Main application handler
    // ─────────────────────────────────────────────────────────────────────────
    public function apply(array $data): array
    {
        try {

            // ── STEP 2a: Validate required fields ────────────────────────────
            $fullName    = trim($data['full_name']    ?? '');
            $email       = trim($data['email']        ?? '');
            $rawPosition = trim($data['position']     ?? '');
            $resumeUrl   = trim($data['resume_url']   ?? '');
            $coverMsg    = trim($data['cover_message'] ?? '');

            if ($fullName === '' || $email === '' || $rawPosition === '') {
                Logger::log("Validation FAIL: missing required fields. full_name='$fullName' email='$email' position='$rawPosition'", "VALIDATION");
                return $this->fail("Full name, email, and position are required.");
            }

            // ── STEP 2b: Validate email format ────────────────────────────────
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Logger::log("Validation FAIL: invalid email '$email'", "VALIDATION");
                return $this->fail("Invalid email address.");
            }

            // ── STEP 2c: Validate / normalise position ────────────────────────
            Logger::log(
                "Position check | incoming='" . $rawPosition . "'"
                . " | normalised='" . self::normalise($rawPosition) . "'"
                . " | allowed=" . json_encode(self::$ALLOWED_POSITIONS, JSON_UNESCAPED_UNICODE),
                "DEBUG"
            );

            $cleanPosition = self::matchPosition($rawPosition);

            if ($cleanPosition === null) {
                Logger::log("Validation FAIL: position not matched. incoming='$rawPosition'", "VALIDATION");
                return $this->fail(
                    "Invalid position selected. Received: \"$rawPosition\". "
                    . "Accepted values: " . implode(', ', self::$ALLOWED_POSITIONS)
                );
            }

            Logger::log("STEP 2: VALIDATION PASSED | position matched to '$cleanPosition' for email '$email'", "INFO");

            // ── STEP 2d: Duplicate check ──────────────────────────────────────
            if ($this->model->isDuplicate($email, $cleanPosition)) {
                Logger::log("Duplicate application blocked: email='$email' position='$cleanPosition'", "VALIDATION");
                return $this->fail("You have already applied for this position in the last 30 days.");
            }

            // ── STEP 3: Save application ──────────────────────────────────────
            $insertData = [
                'full_name'    => $fullName,
                'email'        => $email,
                'position'     => $cleanPosition,   // always store clean title
                'resume_url'   => $resumeUrl,
                'cover_message'=> $coverMsg,
            ];

            $applicationId = $this->model->create($insertData);

            if (!$applicationId) {
                Logger::log("DB insert FAILED for email='$email'", "DB_ERROR");
                return $this->fail("Failed to save your application. Please try again.");
            }

            Logger::log("STEP 3: APPLICATION SAVED | id=$applicationId email='$email' position='$cleanPosition'", "INFO");

            // ── STEP 4: Verify SMTP ───────────────────────────────────────────
            $smtpCheck = $this->emailService->testConnection();

            if (!$smtpCheck['success']) {
                Logger::log("STEP 4: SMTP VERIFICATION FAILED | " . $smtpCheck['message'], "CRITICAL_SMTP");
                return [
                    "success"           => true,
                    "application_saved" => true,
                    "email_sent"        => false,
                    "message"           => "Application saved, but email delivery failed (SMTP error). Reference ID: $applicationId.",
                ];
            }

            Logger::log("STEP 4: SMTP VERIFIED", "INFO");

            // ── STEP 5 & 6: Send emails independently ─────────────────────────
            $hrSent        = false;
            $applicantSent = false;

            // HR email (does NOT depend on applicant email result)
            try {
                $hrSent = $this->emailService->sendHREmail($insertData, $applicationId);
                Logger::log(
                    $hrSent
                        ? "STEP 5: HR EMAIL SENT to careers@goteksystems.com"
                        : "STEP 5: HR EMAIL FAILED (sendHREmail returned false)",
                    $hrSent ? "INFO" : "ERROR"
                );
            } catch (Throwable $e) {
                Logger::log("STEP 5: HR EMAIL EXCEPTION | " . $e->getMessage(), "ERROR");
            }

            // Applicant email (does NOT depend on HR email result)
            try {
                $applicantSent = $this->emailService->sendApplicantEmail(
                    $email, $fullName, $cleanPosition, $applicationId
                );
                Logger::log(
                    $applicantSent
                        ? "STEP 6: APPLICANT EMAIL SENT to '$email'"
                        : "STEP 6: APPLICANT EMAIL FAILED (returned false)",
                    $applicantSent ? "INFO" : "ERROR"
                );
            } catch (Throwable $e) {
                Logger::log("STEP 6: APPLICANT EMAIL EXCEPTION | " . $e->getMessage(), "ERROR");
            }

            $bothSent = $hrSent && $applicantSent;

            return [
                "success"           => true,
                "application_saved" => true,
                "email_sent"        => $bothSent,
                "message"           => $bothSent
                    ? "Application submitted successfully and confirmation email sent."
                    : "Application submitted successfully, but one or more notification emails failed to send.",
            ];

        } catch (Throwable $e) {
            Logger::log("CareerController::apply EXCEPTION | " . $e->getMessage() . " | " . $e->getTraceAsString(), "FATAL");
            return $this->fail("An unexpected server error occurred. Please try again.");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: standard failure response
    // ─────────────────────────────────────────────────────────────────────────
    private function fail(string $message): array
    {
        return [
            "success"           => false,
            "application_saved" => false,
            "email_sent"        => false,
            "message"           => $message,
        ];
    }
}
?>
