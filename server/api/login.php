<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['password'])) {

    $userService = new UserService($db);
    $result = $userService->login($data['email'], $data['password']);
    echo $result->toJson();
} else {
    die('Email is missing.');
}

?>