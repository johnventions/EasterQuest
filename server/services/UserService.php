<?php


namespace EasterQuest;

use PDO;
use EasterQuest\LoggedInState;

class UserService
{
    private $db;
    private $auth;
    private $rand;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
        $this->auth = new \Delight\Auth\Auth($db);
        $this->rand = new \RandomLib\Factory;
    }

    public function checkIfUserExists($email) {
        $stmt = $this->db->prepare('SELECT id 
            FROM users
            WHERE email = :email');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            return $result['id'] != null;
        }
        return false;
    }

    public function getLoginState() {
        if ($this->auth->isLoggedIn()) {
            $userId = $this->auth->getUserId();
            $state = new LoggedInState(true, $userId, null);
            $settings = $this->getUserSettings($userId);
            $state->setSettings($settings);
            return $state;
        }
        else {
            return new LoggedInState(false, null, null);
        }
    }

    public function register($email, $password, $paid)
    {
        // no issues, register user as paid
        try {
            $userId = $this->auth->register($email, $password);
            if ($userId) {
                $this->addUserSettings($userId, true);
                return $this->login($email, $password);
            }
        }
        catch (\Delight\Auth\InvalidEmailException $e) {
            new LoggedInState(false, null, 'Invalid email address');
        }
        catch (\Delight\Auth\InvalidPasswordException $e) {
            return new LoggedInState(false, null, 'Invalid password');
        }
        catch (\Delight\Auth\UserAlreadyExistsException $e) {
            // redirect to login page
            return new LoggedInState(false, null, 'User already exists');
        }
        catch (\Delight\Auth\TooManyRequestsException $e) {
            return new LoggedInState(false, null, 'Too many requests');
        }
    }

    public function getUserSettings($userId)
    {
        $stmt = $this->db->prepare('SELECT hasPaid, shareId 
            FROM user_settings 
            WHERE userId = :userId');
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            return [
                'hasPaid' => (bool) $result['hasPaid'],
                'shareId' => $result['shareId']
            ];
        }
    
        return null; // or return [] if you prefer
    }

    public function addUserSettings($userId, $paid)
    {
        $generator = $this->rand->getGenerator(new \SecurityLib\Strength(\SecurityLib\Strength::MEDIUM));
        $shareId = $generator->generateString(6, '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ');

        $stmt = $this->db->prepare('INSERT INTO user_settings 
            (userId, hasPaid, shareId) 
            VALUES
            (:userId, :hasPaid, :shareId)
        ');

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':hasPaid', $paid, PDO::PARAM_INT);
        $stmt->bindParam(':shareId', $shareId, PDO::PARAM_STR);
        $stmt->execute();

        return $this->getUserSettings($userId);
    }

    public function login($email, $password)
    {
        try {
            $rememberDuration = (int) (60 * 60 * 24 * 30);
            $this->auth->login($email, $password, $rememberDuration);
            $userId = $this->auth->getUserId();
            $state = new LoggedInState(true, $userId, null);
            $settings = $this->getUserSettings($userId);
            $state->setSettings($settings);
            return $state;
        } catch (\Delight\Auth\InvalidEmailException $e) {
             return new LoggedInState(false, null, 'Wrong email address');
        }
        catch (\Delight\Auth\InvalidPasswordException $e) {
            return new LoggedInState(false, null, 'Wrong password');
        }
        catch (\Delight\Auth\EmailNotVerifiedException $e) {
            return new LoggedInState(false, null, 'Email not verified');
        }
        catch (\Delight\Auth\TooManyRequestsException $e) {
            return new LoggedInState(false, null, 'Too many requests');
        }
    }

    public function logout() {
        $this->auth->logOut();
    }

    public function setPassword($password) {
        try {
            $this->auth->changePasswordWithoutOldPassword($password);
            return true;
        }
        catch (\Delight\Auth\InvalidPasswordException $e) {
            return false;
        }
    }
}