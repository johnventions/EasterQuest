
<?

function getQuestById($db, $userId, $questId) {
    $stmt = $db->prepare('
        SELECT * FROM quests 
        WHERE userId = :userId AND id = :id 
        LIMIT 1
    ');

    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':id', $questId, PDO::PARAM_INT);

    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

?>