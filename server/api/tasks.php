<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;

include "../db.php";

$userId = 1;
$questService = new QuestService($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $quests = $questService->getQuests($userId);
    echo json_encode($quests);
    return;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (is_array($data)) {
        $questService->createQuests($userId, $data);
        $quests = $questService->getQuests($userId);
        echo json_encode($quests);
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}
?>