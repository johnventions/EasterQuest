<?php

namespace EasterQuest;

use PDO;

use EasterQuest\LoggedInState as LoggedInState;

class UserService
{
    private $db;
    private $auth;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->auth = new \Delight\Auth\Auth($db);
    }

    public function getLoginState() {
        if ($this->auth->isLoggedIn()) {
            return new LoggedInState(true, $this->auth->getUserId(), null);
        }
        else {
            return new LoggedInState(false, null, null);
        }
    }

    public function register($email, $password)
    {
        // no issues, register user as paid
        try {
            $userId = $this->auth->register($email, $password);
            if ($userId) {
                $this->auth->login($email, $password);
                return new LoggedInState(true, $userId, null);
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

    public function login($email, $password)
    {
        try {
            $this->auth->login($email, $password);
            return new LoggedInState(true, $this->auth->getUserId(), null);
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
}