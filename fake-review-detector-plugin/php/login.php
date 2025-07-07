<?php
header("Content-Type: application/json");
include 'db_connect.php';

$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (!$email || !$password) {
    echo json_encode(array("success" => false, "message" => "All fields required"));
    exit;
}

$hash = md5($password);

$q = "SELECT userId, username FROM users WHERE email='$email' AND password='$hash' LIMIT 1";
$r = mysqli_query($conn, $q);

if ($row = mysqli_fetch_assoc($r)) {
    echo json_encode(array("success" => true, "username" => $row['username'], "email" => $email, "userId" => $row['userId']));
} else {
    echo json_encode(array("success" => false, "message" => "Invalid credentials"));
}
?>
