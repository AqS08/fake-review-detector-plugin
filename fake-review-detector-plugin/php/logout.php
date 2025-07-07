<?php
session_start();
session_destroy();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: chrome-extension://mmhdjkijllimcejkcfbengfonjjbfffk");
header("Access-Control-Allow-Credentials: true");
echo json_encode(["success" => true]);
?>
