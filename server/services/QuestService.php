<?php

namespace EasterQuest;

use PDO;

class QuestService
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function createQuests($userId, $quests)
    {
        $stmt = $this->db->prepare('SELECT MAX(id) as maxId FROM quests WHERE userId = :userId');
        $stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $maxId = $result['maxId'] ?? null;

        $this->db->beginTransaction();

        $sql = 'INSERT INTO quests (userId, type, templateId, title, bodyText) VALUES ';
        $values = [];
        $params = [];

        // Dynamically build the query with placeholders
        foreach ($quests as $index => $row) {
            $templateId = isset($row['id']) ? $row['id'] : 0;
            $order = isset($row['itemOrder']) ? $row['itemOrder'] : 999;

            $values[] = "(:userId_{$index}, :type_{$index}, :templateId_{$index}, :title_{$index}, :bodyText_{$index}, :itemOrder_{$index})";

            $params["userId_{$index}"] = $userId;
            $params["type_{$index}"] = $row['type'];
            $params["templateId_{$index}"] = $templateId;
            $params["title_{$index}"] = $row['title'];
            $params["bodyText_{$index}"] = $row['bodyText'];
            $params["itemOrder_{$index}"] = $order;
        }

        // Combine the base query with the dynamically generated values
        $sql .= implode(', ', $values);

        // Prepare and execute the query
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue(":{$key}", $value);
        }
        
        $stmt->execute();

        // Commit transaction
        $this->db->commit();
        
        $stmt2 = $this->db->prepare('
            SELECT * FROM quests WHERE userId = :userId AND id > :maxId
        ');

        $stmt2->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt2->bindParam(':maxId', $maxId, PDO::PARAM_INT);
        $stmt2->execute();

        return $stmt2->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getQuests($userId)
    {
        $stmt = $this->db->prepare('
            SELECT * 
            FROM quests 
            WHERE userId = :userId
            ORDER BY itemOrder ASC, id ASC
        ');

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getQuestById($userId, $questId)
    {
        $stmt = $this->db->prepare('
            SELECT * FROM quests 
            WHERE userId = :userId AND id = :id 
            LIMIT 1
        ');

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':id', $questId, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateQuestById($userId, $questId, $quest)
    {
        // Begin transaction
        $this->db->beginTransaction();

        $stmt = $this->db->prepare("UPDATE quests
        SET bodyText = :bodyText
        WHERE 
            userId = :userId
            AND id = :id 
        ");

        // Bind parameters
        $stmt->bindParam(':userId', $userId,  PDO::PARAM_INT);
        $stmt->bindParam(':id', $questId, PDO::PARAM_INT);
        $stmt->bindParam(':bodyText', $quest['bodyText'], PDO::PARAM_STR);

        $stmt->execute();

        // Commit transaction
        $this->db->commit();
    }

    public function deleteQuestById($userId, $questId)
    {
        // Begin transaction
        $this->db->beginTransaction();

        $stmt = $this->db->prepare("DELETE FROM quests WHERE userId = :userId AND id = :id");

        // Bind parameters
        $stmt->bindParam(':userId', $userId,  PDO::PARAM_INT);
        $stmt->bindParam(':id', $questId, PDO::PARAM_INT);

        $stmt->execute();

        // Commit transaction
        $this->db->commit();
    }

    
    public function getSharedQuests($userId, $shareId) {
        $stmt = $this->db->prepare('
            SELECT q.* FROM quests q
            JOIN user_settings us ON q.userId = us.userId
            WHERE us.userId = :userId
                AND us.shareId = :shareId
            ORDER BY q.itemOrder ASC, q.id ASC
        ');

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':shareId', $shareId, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}