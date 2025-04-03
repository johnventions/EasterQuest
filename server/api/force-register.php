<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../secrets.php';

use EasterQuest\UserService;

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['access_code'], $data['password'])) {
    if($data['access_code'] != 'easter78xq6y') {
        // reject request
        die('Invalid access code');
    }

    $userService = new UserService($db);
    $result = $userService->register($data['email'], $data['password']);
    echo $result->toJson();
} else {
    die('Email is missing.');
}

?>