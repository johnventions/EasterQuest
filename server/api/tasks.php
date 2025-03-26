<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include "../db.php";
include "./util/getQuests.php";
include "./util/createQuests.php";

$userId = 1;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $quests = getQuests($db, $userId);

    header('Content-Type: application/json');
    echo json_encode( $quests );
    return;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (is_array($data)) {
        createQuests($db, $userId, $data);
        $quests = getQuests($db, $userId);

        header('Content-Type: application/json');
        echo json_encode( $quests );

    } else {
        echo json_encode(["error" => "Invalid input"]);
    }
    $results['success'] = false;
} 

?>
