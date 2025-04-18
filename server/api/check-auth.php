<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

require_once __DIR__ . '/../vendor/autoload.php';
use EasterQuest\UserService;

include "../db.php";
$userService = new UserService($db);
$result = $userService->getLoginState();
echo $result->toJson();