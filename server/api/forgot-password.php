<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

include "../db.php";
use EasterQuest\UserService;
use EasterQuest\EmailService;

$YOUR_DOMAIN = $_ENV['PUBLIC_DOMAIN'] ?? 'https://easterquest.com';
 
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'])) {
    $userService = new UserService($db);
    $result = $userService->sendPasswordReset($data['email']);
    if ($result['success']) {
        // send email
        
        try {
            $resetLink  = $YOUR_DOMAIN . '/reset-password?selector=' . \urlencode($result['selector']) . '&token=' . \urlencode($result['token']);
            $emailService = new EmailService();
            $emailSuccess = $emailService->sendPasswordResetEmail($data['email'], "Password Reset for Easter Quest", $resetLink);
        } catch(Exception $e)  {
            $emailSuccess = false;
        }
    }
    echo json_encode($result);
} else {
    die('Email is missing.');
}

?>