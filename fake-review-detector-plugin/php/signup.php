<?php
header("Content-Type: application/json");
include 'db_connect.php';

// Fetch POST data
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (!$username || !$email || !$password) {
    echo json_encode(array("success" => false, "message" => "All fields required"));
    exit;
}

// Check if email exists
$q = "SELECT userId FROM users WHERE email='$email' LIMIT 1";
$r = mysqli_query($conn, $q);
if (mysqli_num_rows($r) > 0) {
    echo json_encode(array("success" => false, "message" => "Email already exists"));
    exit;
}

// Hash password (md5 for PHP 5.3.5, NOT for production)
$hash = md5($password);

// Insert user
$q = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hash')";
if (mysqli_query($conn, $q)) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "message" => "Signup failed"));
}
?>
