
<?

function getQuests($db, $userId) {
    $q = array();

    $stmt = $db->prepare('
        SELECT * FROM quests WHERE userId = 1');
    $stmt->execute(array());

    $row_count = $stmt->rowCount();

    if ($row_count > 0) {
        while($quest = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($q, $quest);
        }
    }

    return $q;
}

?>