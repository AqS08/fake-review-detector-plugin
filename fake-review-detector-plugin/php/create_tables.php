<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

// SQL to create the users table
$sql = "
CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
";

// Run the query
if (mysqli_query($conn, $sql)) {
    echo "<b>Table 'users' created successfully (or already exists)!</b>";
} else {
    echo "<b>Error creating table:</b> " . mysqli_error($conn);
}

mysqli_close($conn);
?>
