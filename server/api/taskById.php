<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;
use EasterQuest\UserService;

include "../db.php";

$questService = new QuestService($db);

$userService = new UserService($db);
$result = $userService->getLoginState();

$userId = $result->getUserId();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $questId = $_GET['id'];
    $data = json_decode(file_get_contents("php://input"), true);

    $questService->updateQuestById($userId, $questId, $data);
    $quest = $questService->getQuestById($userId, $questId);

    echo json_encode($quest);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $questId = $_GET['id'];
    $questService->deleteQuestById($userId, $questId);
    echo json_encode(['message' => 'Quest deleted successfully']);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}
?>