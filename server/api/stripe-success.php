<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ .'/../');
$dotenv->load();


use EasterQuest\UserService;
include "../db.php";

// Get the session ID from the URL
$session_id = $_GET['session_id'] ?? null;

if (!$session_id) {
    die('Session ID is missing.');
}


\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET']);

// Retrieve the checkout session from Stripe
try {
    $session = \Stripe\Checkout\Session::retrieve($session_id);
    
    // Optional: Retrieve payment details
    $payment_intent_id = $session->payment_intent ?? null;
    if (!$payment_intent_id) {
        die('No PaymentIntent associated with this session.');
    }

    // Retrieve payment intent for strong confirmation
    $payment_intent = \Stripe\PaymentIntent::retrieve($payment_intent_id);

    // Strong Confirmation: Payment was successful
    if ($payment_intent->status === 'succeeded') {
        $email = $session->metadata->email;

        $userService = new UserService($db);

        $result = $userService->register($email, $_ENV['DEFAULT_PASS'], true);
        $result = $userService->login($email, $_ENV['DEFAULT_PASS']);

        Header('Location: /setup?purchase=true&session_id=' . urlencode($session_id));
        exit();
    } else {
        // Handle other statuses
        echo "Payment status: " . htmlspecialchars($payment_intent->status);
    }

   

} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

?>