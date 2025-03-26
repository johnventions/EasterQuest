<?

function createQuests($db, $userId, $quests) {
    // Prepare an SQL statement
    $stmt = $db->prepare("INSERT INTO quests 
        (userId, type, templateId, title, bodyText) 
        VALUES
        (:userId, :type, :templateId, :title, :bodyText)
    ");

    // Begin transaction
    $db->beginTransaction();

    foreach ($quests as $row) {
        $templateId = isset($row['id']) ? $row['id'] : 0;
        $order = isset($row['order']) ? $row['order'] : 999;
        if (isset($row['type'], $row['title'], $row['bodyText'])) {
            // Bind parameters
            $stmt->bindParam(':userId', $userId,  PDO::PARAM_INT);
            $stmt->bindParam(':type', $row['type'], PDO::PARAM_INT);
            $stmt->bindParam(':templateId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':title', $row['title'], PDO::PARAM_STR);
            $stmt->bindParam(':bodyText', $row['bodyText'], PDO::PARAM_STR);

            // Execute the statement
            $stmt->execute();
        }
    }

    // Commit transaction
    $db->commit();
}