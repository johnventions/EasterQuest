<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', '1');
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