<?php
require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\UserService;
use EasterQuest\EmailService;

include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['email'], $data['access_code'], $data['password'])) {
    if(strcasecmp(trim($data['access_code']), 'easter78xq6y') !== 0) {
        // reject request
        die('Invalid access code');
    }

    $userService = new UserService($db);
    $result = $userService->register($data['email'], $data['password'], true);
    try {
        $emailService = new EmailService();
        $emailBody = file_get_contents(__DIR__ . '/welcomeEmail.html');
        $emailService->sendMail($data['email'], "Welcome to Easter Quest!");
    } catch(Exception $e)  {
    }
    echo $result->toJson();
} else {
    die('Email is missing.');
}

?>