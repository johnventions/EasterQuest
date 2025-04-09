<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;

 
$result = array(
    'success' => false,
    'reason' => ''
);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['password'])) {
    $userService = new UserService($db);
    $auth = $userService->getLoginState();
    if ($auth->getIsLoggedIn()) {
        $changed = $userService->setPassword($data['password']);
        $result['success'] = $changed;
    }
    echo json_encode($result);
} else {
    die('Email is missing.');
}

?>