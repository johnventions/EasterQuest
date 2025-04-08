<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

use EasterQuest\UserService;

include "../db.php";

$result = array(
  'url' => '',
  'success' => false,
  'reason' => ''
);

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email'])) {
  echo json_encode($result);
  exit;
}

// check if email already exists
$userService = new UserService($db);
$exists = $userService->checkIfUserExists($data['email']);
if ($exists == true) {
  $result['reason'] = 'Account already exists';
  echo json_encode($result);
  exit;
}

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET']);

$YOUR_DOMAIN = $_ENV['PUBLIC_DOMAIN'] ?? 'https://easterquest.com';

$checkout_session = \Stripe\Checkout\Session::create([
  'ui_mode' => 'hosted',
  'mode' => 'payment',
  'line_items' => [[
    'price' => $_ENV['PRICE_ID'],
    'quantity' => 1,
  ]],
  'metadata' => [
      'email' =>  $data['email'],
  ],
  "shipping_address_collection" => null,
  'success_url' => $YOUR_DOMAIN . '/stripe/success?session_id={CHECKOUT_SESSION_ID}',
]);

$result['url'] = $checkout_session->url;
$result['success'] = true;

echo json_encode($result);