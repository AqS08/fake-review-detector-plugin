<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

// List of table names and their SQL create statements
$tables = array(
    "users" => "CREATE TABLE IF NOT EXISTS users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )",

    "Hotel" => "CREATE TABLE IF NOT EXISTS Hotel (
        hotelId INT AUTO_INCREMENT PRIMARY KEY,
        hotelName VARCHAR(100),
        websiteUrl TEXT
    )",

    "ExtractedReview" => "CREATE TABLE IF NOT EXISTS ExtractedReview (
        extractedId INT AUTO_INCREMENT PRIMARY KEY,
        hotelId INT,
        userId INT NULL,
        extractedTime DATETIME,
        reviewerName VARCHAR(100),
        reviewText TEXT,
        processed BOOLEAN,
        FOREIGN KEY (hotelId) REFERENCES Hotel(hotelId),
        FOREIGN KEY (userId) REFERENCES users(userId)
    )",

    "Result" => "CREATE TABLE IF NOT EXISTS Result (
        resultId INT AUTO_INCREMENT PRIMARY KEY,
        hotelId INT,
        userId INT,
        analysisDate DATETIME,
        overallGenuine DOUBLE,
        overallFake DOUBLE,
        FOREIGN KEY (hotelId) REFERENCES Hotel(hotelId),
        FOREIGN KEY (userId) REFERENCES users(userId)
    )",

    "Review" => "CREATE TABLE IF NOT EXISTS Review (
        reviewId INT AUTO_INCREMENT PRIMARY KEY,
        resultId INT,
        reviewerName VARCHAR(100),
        reviewText TEXT,
        genuinePercent DOUBLE,
        fakePercent DOUBLE,
        FOREIGN KEY (resultId) REFERENCES Result(resultId)
    )",

    "WordFrequency" => "CREATE TABLE IF NOT EXISTS WordFrequency (
        wordId INT AUTO_INCREMENT PRIMARY KEY,
        resultId INT,
        word VARCHAR(100),
        frequency INT,
        FOREIGN KEY (resultId) REFERENCES Result(resultId)
    )",

    "FrequentReviewer" => "CREATE TABLE IF NOT EXISTS FrequentReviewer (
        frequentId INT AUTO_INCREMENT PRIMARY KEY,
        resultId INT,
        reviewerName VARCHAR(100),
        reviewCount INT,
        FOREIGN KEY (resultId) REFERENCES Result(resultId)
    )"
);

foreach ($tables as $tableName => $sql) {
    // Check if table exists
    $check = mysqli_query($conn, "SHOW TABLES LIKE '$tableName'");
    if (mysqli_num_rows($check) > 0) {
        echo "Table '$tableName' already exists.<br>";
        continue;
    }

    // Try to create the table
    if (mysqli_query($conn, $sql)) {
        echo "Table '$tableName' created successfully.<br>";
    } else {
        echo "Error creating table '$tableName': " . mysqli_error($conn) . "<br>";
    }
}

mysqli_close($conn);
?>
