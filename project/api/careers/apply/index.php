<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS preflight request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
$baseDir = __DIR__ . '/../../../';
require_once $baseDir . 'config/Database.php';
require_once $baseDir . 'utils/Logger.php';
require_once $baseDir . 'models/CareerModel.php';
require_once $baseDir . 'services/EmailService.php';
require_once $baseDir . 'controllers/CareerController.php';

// ─── Only accept POST from here on ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success"           => false,
        "application_saved" => false,
        "email_sent"        => false,
        "message"           => "Method not allowed."
    ]);
    exit;
}

// ─── Rate Limiting (session-based, 10 requests per hour per IP) ───────────────
session_start();
$ip           = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitKey = 'rl_' . md5($ip);

if (!isset($_SESSION[$rateLimitKey])) {
    $_SESSION[$rateLimitKey] = ['count' => 0, 'start' => time()];
}

// Reset window after 1 hour
if ((time() - $_SESSION[$rateLimitKey]['start']) > 3600) {
    $_SESSION[$rateLimitKey] = ['count' => 0, 'start' => time()];
}

$_SESSION[$rateLimitKey]['count']++;

if ($_SESSION[$rateLimitKey]['count'] > 10) {
    http_response_code(429);
    Logger::log("Rate limit exceeded for IP: $ip", "RATE_LIMIT");
    echo json_encode([
        "success"           => false,
        "application_saved" => false,
        "email_sent"        => false,
        "message"           => "Too many requests. Please wait before submitting again."
    ]);
    exit;
}

// ─── Parse incoming JSON or fall back to POST body ────────────────────────────
$rawInput = file_get_contents("php://input");
$data     = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    $data = $_POST;
}

Logger::log(
    "STEP 1: API HIT | IP: $ip | payload: " . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    "INFO"
);

// ─── Execute ─────────────────────────────────────────────────────────────────
try {
    $db           = (new Database())->getConnection();
    $model        = new CareerModel($db);
    $emailService = new EmailService($db);
    $controller   = new CareerController($model, $emailService);

    $result = $controller->apply($data);

    http_response_code($result['success'] ? 200 : 400);

    Logger::log(
        "STEP 7: RESPONSE RETURNED | success=" . ($result['success'] ? 'true' : 'false')
        . " | msg=" . $result['message'],
        "INFO"
    );

    echo json_encode($result);

} catch (Throwable $e) {
    Logger::log("FATAL API Exception: " . $e->getMessage() . " | " . $e->getTraceAsString(), "FATAL");
    http_response_code(500);
    echo json_encode([
        "success"           => false,
        "application_saved" => false,
        "email_sent"        => false,
        "message"           => "Internal server error. Please contact support."
    ]);
}
?>
