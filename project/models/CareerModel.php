<?php
class CareerModel
{
    private $conn;
    private $table = "career_applications";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Returns true if the same email+position was submitted within the last 30 days.
     */
    public function isDuplicate(string $email, string $position): bool
    {
        $sql  = "SELECT id FROM {$this->table}
                 WHERE email    = :email
                   AND position = :position
                   AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                 LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email',    $email,    PDO::PARAM_STR);
        $stmt->bindValue(':position', $position, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Insert a new application.
     * Returns the new row ID on success, false on failure.
     */
    public function create(array $data)
    {
        $sql = "INSERT INTO {$this->table}
                    (full_name, email, position, resume_url, cover_message, application_status)
                VALUES
                    (:full_name, :email, :position, :resume_url, :cover_message, 'Pending')";

        $stmt = $this->conn->prepare($sql);

        // Sanitise every field before binding
        $stmt->bindValue(':full_name',    htmlspecialchars(strip_tags($data['full_name']    ?? ''), ENT_QUOTES, 'UTF-8'), PDO::PARAM_STR);
        $stmt->bindValue(':email',        htmlspecialchars(strip_tags($data['email']        ?? ''), ENT_QUOTES, 'UTF-8'), PDO::PARAM_STR);
        $stmt->bindValue(':position',     htmlspecialchars(strip_tags($data['position']     ?? ''), ENT_QUOTES, 'UTF-8'), PDO::PARAM_STR);
        $stmt->bindValue(':resume_url',   htmlspecialchars(strip_tags($data['resume_url']   ?? ''), ENT_QUOTES, 'UTF-8'), PDO::PARAM_STR);
        $stmt->bindValue(':cover_message',htmlspecialchars(strip_tags($data['cover_message']?? ''), ENT_QUOTES, 'UTF-8'), PDO::PARAM_STR);

        if ($stmt->execute()) {
            return (int) $this->conn->lastInsertId();
        }
        return false;
    }
}
?>
