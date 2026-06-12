<?php
require_once __DIR__ . '/../config/Database.php';
// Include PHPMailer autoload if required, else assume it is included manually
// require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../services/EmailService.php';

// Instantiate DB & Service
$database = new Database();
$db = $database->getConnection();
$emailService = new EmailService($db);

$testMessage = "";
$testStatus = "";
$smtpStatus = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'test_smtp') {
        $result = $emailService->testConnection();
        $smtpStatus = $result['message'];
    } elseif (isset($_POST['action']) && $_POST['action'] === 'send_test') {
        $to = $_POST['test_email'] ?? '';
        if (filter_var($to, FILTER_VALIDATE_EMAIL)) {
            $success = $emailService->sendTestMail($to);
            if ($success) {
                $testStatus = "Test email sent successfully to $to.";
            } else {
                $testStatus = "Failed to send test email. Check logs.";
            }
        } else {
            $testStatus = "Invalid email address.";
        }
    }
}

// Get recent logs
$logs = $emailService->getRecentLogs(50);
$logFile = __DIR__ . '/../logs/email.log';
$fileLogs = file_exists($logFile) ? file_get_contents($logFile) : "No log file found.";
?>
<!DOCTYPE html>
<html>
<head>
    <title>Email Debug Panel</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        .container { background: #fff; padding: 20px; border-radius: 8px; max-width: 1000px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1, h2 { color: #333; }
        .box { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 5px; background: #fafafa; }
        input[type="text"], input[type="email"] { padding: 8px; width: 300px; }
        button { padding: 8px 15px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 3px; }
        button:hover { background: #0056b3; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #eee; }
        pre { background: #333; color: #0f0; padding: 15px; overflow-x: auto; border-radius: 5px; max-height: 400px; overflow-y: auto; }
        .alert { padding: 10px; margin-bottom: 10px; border-radius: 4px; }
        .alert-info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
<div class="container">
    <h1>Admin Email Debug Panel</h1>

    <div class="box">
        <h2>1. Check SMTP Status</h2>
        <form method="POST">
            <input type="hidden" name="action" value="test_smtp">
            <button type="submit">Test Connection</button>
        </form>
        <?php if ($smtpStatus): ?>
            <div class="alert alert-info" style="margin-top: 10px;"><?= htmlspecialchars($smtpStatus) ?></div>
        <?php endif; ?>
    </div>

    <div class="box">
        <h2>2. Send Test Email</h2>
        <form method="POST">
            <input type="hidden" name="action" value="send_test">
            <input type="email" name="test_email" placeholder="Recipient Email" required>
            <button type="submit">Send Test Email</button>
        </form>
        <?php if ($testStatus): ?>
            <div class="alert alert-info" style="margin-top: 10px;"><?= htmlspecialchars($testStatus) ?></div>
        <?php endif; ?>
    </div>

    <div class="box">
        <h2>3. Database Email Logs (Last 50)</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>App ID</th>
                <th>Type</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Error Message</th>
                <th>Sent At</th>
            </tr>
            <?php foreach ($logs as $log): ?>
            <tr>
                <td><?= $log['id'] ?></td>
                <td><?= $log['application_id'] ?: 'N/A' ?></td>
                <td><?= htmlspecialchars($log['email_type']) ?></td>
                <td><?= htmlspecialchars($log['recipient_email']) ?></td>
                <td><strong style="color: <?= $log['status'] === 'Failed' ? 'red' : 'green' ?>;"><?= $log['status'] ?></strong></td>
                <td><?= htmlspecialchars($log['error_message'] ?: '-') ?></td>
                <td><?= $log['sent_at'] ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if (empty($logs)): ?>
            <tr><td colspan="7">No logs found.</td></tr>
            <?php endif; ?>
        </table>
    </div>

    <div class="box">
        <h2>4. PHPMailer / Application Logs (logs/email.log)</h2>
        <pre><?= htmlspecialchars($fileLogs) ?></pre>
    </div>
</div>
</body>
</html>
