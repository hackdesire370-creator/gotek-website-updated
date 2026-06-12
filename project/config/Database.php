<?php
class Database
{
    private $host     = "localhost";
    private $db_name  = "gotek_db";
    private $username = "root";
    private $password = "";

    public $conn;

    public function getConnection(): PDO
    {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            // Use the Logger utility so we don't need error.log path to pre-exist
            $logDir  = __DIR__ . '/../logs';
            $logFile = $logDir . '/email.log';

            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }

            $timestamp = date('Y-m-d H:i:s');
            file_put_contents(
                $logFile,
                "[$timestamp] [DB_ERROR] - Connection error: " . $e->getMessage() . PHP_EOL,
                FILE_APPEND
            );

            http_response_code(500);
            header("Content-Type: application/json");
            echo json_encode([
                "success"           => false,
                "application_saved" => false,
                "email_sent"        => false,
                "message"           => "Database connection failed. Please try again later.",
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
