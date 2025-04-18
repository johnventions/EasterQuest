<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['password'], $data['selector'], $data['token'])) {
    $userService = new UserService($db);
    $result = $userService->finishPasswordReset($data['selector'], $data['token'], $data['password']);
    echo json_encode($result);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Missing data'
    ]);
}

?>