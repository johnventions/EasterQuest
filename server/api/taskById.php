<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;
use EasterQuest\UserService;

include "../db.php";

$userId = 1;
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
}
?>