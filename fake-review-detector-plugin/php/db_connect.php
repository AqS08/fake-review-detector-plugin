<?php
// db_connect.php
$host = "localhost";
$user = "root";
$pass = "";
$db = "fake-review-detector-plugin";

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    die(json_encode(array("success" => false, "message" => "Database connection failed")));
}
?>
