<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../vendor/autoload.php';
use EasterQuest\UserService;

include "../db.php";
$userService = new UserService($db);
$result = $userService->getLoginState();
echo $result->toJson();