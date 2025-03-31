<?php

$username="{USERNAME}";
$password="{PASSWORD}";
$database="{DBNAME}";

$db = new PDO('mysql:host={DB HOST URL};dbname=' . $database .';charset=utf8', $username, $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES , false);
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);

?>
