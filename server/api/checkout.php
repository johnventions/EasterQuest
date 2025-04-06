<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$result = array(
  'url' => '',
  'success' => false
);

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email'])) {
  echo json_encode($result);
  exit;
}

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET']);

$YOUR_DOMAIN = $_ENV['PUBLIC_DOMAIN'] ?? 'https://easterquest.com';

$checkout_session = \Stripe\Checkout\Session::create([
  'ui_mode' => 'hosted',
  'mode' => 'payment',
  'line_items' => [[
    'price' => 'price_1R8vTiIY1FR3dPPOEwquaKax',
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