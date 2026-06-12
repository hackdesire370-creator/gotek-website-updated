<?php
$host = "localhost";
$username = "root";
$password = "";

try {
    // Connect to MySQL server without specifying a database first
    $conn = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create the database
    $conn->exec("CREATE DATABASE IF NOT EXISTS gotek_db");
    echo "Database 'gotek_db' created or already exists.\n";
    
    // Select the database
    $conn->exec("USE gotek_db");
    
    // Read the schema.sql file
    $schemaPath = __DIR__ . '/schema.sql';
    if (file_exists($schemaPath)) {
        $sql = file_get_contents($schemaPath);
        // Execute the SQL queries
        $conn->exec($sql);
        echo "Tables created successfully from schema.sql.\n";
    } else {
        echo "Error: schema.sql file not found.\n";
    }
} catch(PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
    echo "Please ensure your local MySQL server is running and the root user has no password.\n";
}
?>
