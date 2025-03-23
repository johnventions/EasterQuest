<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include "../db.php";
$results = array();

$stmt = $db->prepare('
    SELECT * FROM quests');
$stmt->execute(array());

$row_count = $stmt->rowCount();
$results['count'] = $row_count;
$results['success'] = false;

if ($row_count > 0) {
    $results['success'] = true;
    $results['quests'] = array();
    while($book = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($results['quests'], $book);
    }
}

header('Content-Type: application/json');
echo json_encode( $results );
?>
