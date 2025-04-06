<?php

namespace EasterQuest;

class LoggedInState {
    private $isLoggedIn;
    private $userId;
    private $error;
    private $hasPaid = false;
    private $shareId = '';

    public function __construct(bool $isLoggedIn, ?int $userId = null, ?string $error = null) {
        $this->isLoggedIn = $isLoggedIn;
        $this->userId = $userId;
        $this->error = $error;
    }

    public function getIsLoggedIn(): bool {
        return $this->isLoggedIn;
    }

    public function getUserId(): ?int {
        return $this->userId;
    }

    public function setIsLoggedIn(bool $isLoggedIn): void {
        $this->isLoggedIn = $isLoggedIn;
    }

    public function setUserId(?int $userId): void {
        $this->userId = $userId;
    }

    public function setSettings($settings): void {
        $this->hasPaid = $settings['hasPaid'] ?? false;
        $this->shareId = $settings['shareId'] ?? '';
    }

    public function toJson() {
        return json_encode([
            'isLoggedIn' => $this->isLoggedIn,
            'userId' => $this->userId,
            'error' => $this->error,
            'hasPaid' => $this->hasPaid,
            'shareId' => $this->userId . "-" . $this->shareId
        ]);
    }
    
}

?>