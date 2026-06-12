<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as MailException;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Logger.php';

class EmailService
{
    private $db;

    // ── SMTP credentials ────────────────────────────────────────────────────
    private $smtpHost   = 'smtp.gmail.com';
    private $smtpUser   = 'harihara123454@gmail.com';   // update if needed
    private $smtpPass   = 'ufuwnvselwgvriev';            // Gmail App Password
    private $smtpPort   = 587;
    private $smtpSecure = PHPMailer::ENCRYPTION_STARTTLS;
    private $fromName   = 'GOTEK Careers';
    private $hrEmail    = 'careers@goteksystems.com';

    public function __construct($db)
    {
        $this->db = $db;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Build a configured PHPMailer instance.
    // $debug=true: logs SMTP conversation to email.log (no stdout output).
    // ─────────────────────────────────────────────────────────────────────────
    private function makeMailer(bool $debug = true): PHPMailer
    {
        $mailer = new PHPMailer(true);  // exceptions enabled

        $mailer->isSMTP();
        $mailer->Host       = $this->smtpHost;
        $mailer->SMTPAuth   = true;
        $mailer->Username   = $this->smtpUser;
        $mailer->Password   = $this->smtpPass;
        $mailer->SMTPSecure = $this->smtpSecure;
        $mailer->Port       = $this->smtpPort;
        $mailer->CharSet    = PHPMailer::CHARSET_UTF8;

        if ($debug) {
            $mailer->SMTPDebug  = SMTP::DEBUG_SERVER;
            $mailer->Debugoutput = static function (string $str, int $level): void {
                Logger::log("SMTP[$level] $str", "SMTP_DEBUG");
            };
        }

        return $mailer;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Test SMTP connectivity (used as pre-flight before sending real emails).
    // ─────────────────────────────────────────────────────────────────────────
    public function testConnection(): array
    {
        try {
            $mailer          = $this->makeMailer(true);
            $mailer->Timeout = 10;

            $connected = $mailer->smtpConnect();
            $mailer->smtpClose();

            if ($connected) {
                return ["success" => true, "message" => "SMTP connection successful."];
            }
            return ["success" => false, "message" => "smtpConnect() returned false."];

        } catch (Throwable $e) {
            Logger::log("SMTP test connection FAILED: " . $e->getMessage(), "SMTP_ERROR");
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Send applicant acknowledgement email.
    // ─────────────────────────────────────────────────────────────────────────
    public function sendApplicantEmail(
        string $toEmail,
        string $toName,
        string $position,
        int    $applicationId
    ): bool {
        $replacements = [
            '[Applicant Name]'  => $toName,
            '[Applicant Email]' => $toEmail,
            '[Position Name]'   => $position,
            '[Date]'            => date('d M Y'),
        ];

        return $this->dispatch(
            $toEmail,
            $toName,
            'Application Received – GOTEK Careers',
            'applicant_email.html',
            $replacements,
            'Applicant Acknowledgement',
            $applicationId
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Send HR notification email.
    // ─────────────────────────────────────────────────────────────────────────
    public function sendHREmail(array $data, int $applicationId): bool
    {
        $replacements = [
            '[Applicant Name]'  => htmlspecialchars($data['full_name']    ?? '', ENT_QUOTES, 'UTF-8'),
            '[Applicant Email]' => htmlspecialchars($data['email']        ?? '', ENT_QUOTES, 'UTF-8'),
            '[Position Name]'   => htmlspecialchars($data['position']     ?? '', ENT_QUOTES, 'UTF-8'),
            '[Resume URL]'      => htmlspecialchars($data['resume_url']   ?? 'N/A', ENT_QUOTES, 'UTF-8'),
            '[Cover Message]'   => nl2br(htmlspecialchars($data['cover_message'] ?? 'N/A', ENT_QUOTES, 'UTF-8')),
            '[Date]'            => date('d M Y, H:i'),
        ];

        return $this->dispatch(
            $this->hrEmail,
            'GOTEK HR',
            'New Career Application Received',
            'hr_email.html',
            $replacements,
            'HR Notification',
            $applicationId
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Send a quick test email (used by /admin/email-test.php).
    // ─────────────────────────────────────────────────────────────────────────
    public function sendTestMail(string $toEmail): bool
    {
        return $this->dispatch(
            $toEmail,
            'Test User',
            'SMTP Test – GOTEK Careers',
            null,
            [],
            'Test Email',
            null,
            '<p style="font-family:sans-serif;">This is a test email confirming SMTP is working correctly.</p>'
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core sending method.
    // ─────────────────────────────────────────────────────────────────────────
    private function dispatch(
        string  $toEmail,
        string  $toName,
        string  $subject,
        ?string $templateFile,
        array   $replacements,
        string  $emailType,
        ?int    $applicationId,
        ?string $directHtml = null
    ): bool {
        $mailer = $this->makeMailer(true);

        try {
            $mailer->setFrom($this->smtpUser, $this->fromName);
            $mailer->addAddress($toEmail, $toName);
            $mailer->isHTML(true);
            $mailer->Subject = $subject;

            if ($directHtml !== null) {
                $mailer->Body = $directHtml;
            } else {
                $tplPath = __DIR__ . '/../templates/' . $templateFile;

                if (!file_exists($tplPath)) {
                    throw new \RuntimeException("Email template not found: $tplPath");
                }

                $html = file_get_contents($tplPath);
                if ($html === false) {
                    throw new \RuntimeException("Could not read template: $tplPath");
                }

                $mailer->Body = str_replace(
                    array_keys($replacements),
                    array_values($replacements),
                    $html
                );
            }

            $mailer->AltBody = strip_tags($mailer->Body);
            $mailer->send();

            $this->logEmail($applicationId, $emailType, $toEmail, 'Sent', null);
            return true;

        } catch (Throwable $e) {
            $err = $e->getMessage() . ' | PHPMailer: ' . $mailer->ErrorInfo;
            Logger::log("Email dispatch FAILED | type=$emailType to=$toEmail | $err", "SEND_ERROR");
            $this->logEmail($applicationId, $emailType, $toEmail, 'Failed', $err);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Insert a row into email_logs.
    // ─────────────────────────────────────────────────────────────────────────
    private function logEmail(
        ?int    $applicationId,
        string  $emailType,
        string  $recipient,
        string  $status,
        ?string $errorMessage
    ): void {
        try {
            $sql  = "INSERT INTO email_logs
                         (application_id, email_type, recipient_email, status, error_message)
                     VALUES
                         (:app_id, :type, :recipient, :status, :error)";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':app_id',    $applicationId, $applicationId ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $stmt->bindValue(':type',      $emailType,     PDO::PARAM_STR);
            $stmt->bindValue(':recipient', $recipient,     PDO::PARAM_STR);
            $stmt->bindValue(':status',    $status,        PDO::PARAM_STR);
            $stmt->bindValue(':error',     $errorMessage,  $errorMessage  ? PDO::PARAM_STR : PDO::PARAM_NULL);
            $stmt->execute();
        } catch (Throwable $e) {
            Logger::log("email_logs insert FAILED: " . $e->getMessage(), "DB_ERROR");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fetch recent logs for admin panel.
    // ─────────────────────────────────────────────────────────────────────────
    public function getRecentLogs(int $limit = 50): array
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT :lim"
            );
            $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            Logger::log("getRecentLogs FAILED: " . $e->getMessage(), "DB_ERROR");
            return [];
        }
    }
}
?>