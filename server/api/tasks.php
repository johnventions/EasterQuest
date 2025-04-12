<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;
use EasterQuest\UserService;

include "../db.php";

$userId = 1;
$questService = new QuestService($db);
$userService = new UserService($db);
$result = $userService->getLoginState();

$userId = $result->getUserId();

if($result->getIsLoggedIn() === false) {
    echo json_encode(["error" => "User not logged in"]);
    return;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $quests = $questService->getQuests($userId);
    echo json_encode($quests);
    return;
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (is_array($data)) {
        $quests = $questService->createQuests($userId, $data);
        echo json_encode($quests);
    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
}
?>