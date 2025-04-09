<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;

$userService = new UserService($db);
$result = $userService->logout();

?>