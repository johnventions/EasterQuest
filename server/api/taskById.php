<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include "../db.php";
include "./util/updateQuestById.php";
include "./util/getQuestById.php";

$userId = 1;

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $questId = $_GET['id'];
    $data = json_decode(file_get_contents("php://input"), true);
    updateQuestById($db, $userId, $questId, $data);

    $quest = getQuestById($db, $userId, $questId);

    header('Content-Type: application/json');
    echo json_encode( $quest );
}
?>