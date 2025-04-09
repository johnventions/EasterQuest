<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;
use EasterQuest\UserService;

include "../db.php";

$questService = new QuestService($db);

$userService = new UserService($db);
$result = $userService->getLoginState();

$userId = $result->getUserId();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $result = $questService->udpateQuestOrder($userId, $data);
    echo json_encode($result);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}
?>