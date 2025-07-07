<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:8888");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION['userId'])) {
    echo json_encode(array("success" => false, "message" => "Not logged in"));
    exit;
}

echo json_encode(array("success" => true, "history" => $history));
?>
