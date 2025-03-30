<?php

function updateQuestById($db, $userId, $questId, $quest) {
    // Prepare an SQL statement
    $stmt = $db->prepare("UPDATE quests
        SET bodyText = :bodyText
        WHERE 
            userId = :userId
            AND id = :id 
    ");

    // Begin transaction
    $db->beginTransaction();

    // Bind parameters
    $stmt->bindParam(':userId', $userId,  PDO::PARAM_INT);
    $stmt->bindParam(':id', $questId, PDO::PARAM_INT);
    $stmt->bindParam(':bodyText', $quest['bodyText'], PDO::PARAM_STR);

    // Execute the statement
    $stmt->execute();

    // Commit transaction
    $db->commit();
}

?>