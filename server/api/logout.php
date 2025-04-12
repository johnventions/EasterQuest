<?php

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;

$userService = new UserService($db);
$result = $userService->logout();

?>