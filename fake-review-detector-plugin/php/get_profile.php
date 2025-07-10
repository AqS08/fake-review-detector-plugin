<?php
session_set_cookie_params(604800, "/");
session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: chrome-extension://mmhdjkijllimcejkcfbengfonjjbfffk");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION['userId'])) {
    echo json_encode(array("success" => false, "message" => "Not logged in"));
    exit;
}

echo json_encode(array(
    "success" => true,
    "userId" => $_SESSION['userId'],
    "username" => $_SESSION['username'],
    "password" => $_SESSION['password'],
    "email" => $_SESSION['email'],
    "session" => $_SESSION,
    "sid" => session_id()
));
?>
