<?php

$username="{USERNAME}";
$password="{PASSWORD}";
$database="{DBNAME}";

$db = new PDO('mysql:host={DB HOST URL};dbname=' . $database .';charset=utf8', $username, $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


?>
