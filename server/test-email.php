<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . './vendor/autoload.php';

include "./db.php";
use EasterQuest\EmailService;

 
$result = array(
    'success' => false,
    'reason' => ''
);

$svc = new EmailService($db);
$worked = $svc->sendMail("johnharoldhorton@gmail.com", "Welcome!");
echo $worked;

?>