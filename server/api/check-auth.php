<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';
use EasterQuest\UserService;

include "../db.php";
$userService = new UserService($db);
$result = $userService->getLoginState();
echo $result->toJson();