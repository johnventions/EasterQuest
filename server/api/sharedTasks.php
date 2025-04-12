<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\QuestService;

include "../db.php";

$questService = new QuestService($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    list($userId, $shareId) = explode('-', $_GET['id']);

    $quest = $questService->getSharedQuests($userId, $shareId);

    echo json_encode($quest);
}
?>