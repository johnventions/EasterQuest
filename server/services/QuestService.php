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
        $this->db->beginTransaction();

        $sql = 'INSERT INTO quests (userId, type, templateId, title, bodyText) VALUES ';
        $values = [];
        $params = [];

        // Dynamically build the query with placeholders
        foreach ($quests as $index => $row) {
            $templateId = isset($row['id']) ? $row['id'] : 0;
            $order = isset($row['order']) ? $row['order'] : 999;

            $values[] = "(:userId_{$index}, :type_{$index}, :templateId_{$index}, :title_{$index}, :bodyText_{$index})";

            $params["userId_{$index}"] = $userId;
            $params["type_{$index}"] = $row['type'];
            $params["templateId_{$index}"] = $templateId;
            $params["title_{$index}"] = $row['title'];
            $params["bodyText_{$index}"] = $row['bodyText'];
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
    }

    public function getQuests($userId)
    {
        $stmt = $this->db->prepare('
            SELECT * FROM quests WHERE userId = :userId
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
}