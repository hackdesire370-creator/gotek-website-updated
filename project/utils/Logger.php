<?php
class Logger {
    private static $logFile = __DIR__ . '/../logs/email.log';

    public static function log($message, $type = 'ERROR') {
        $timestamp = date('Y-m-d H:i:s');
        $formattedMessage = "[$timestamp] [$type] - $message" . PHP_EOL;
        
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        file_put_contents(self::$logFile, $formattedMessage, FILE_APPEND);
    }
}
?>
