<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;

// Get the URL from a query parameter
$url = 'https://easterquest.com/share/' . $_GET['id'] ?? '';

// Generate the QR code
$result = Builder::create()
    ->writer(new PngWriter())
    ->data($url)
    ->size(300)
    ->margin(10)
    ->build();

// Set headers to indicate it's a PNG image and prevent caching
header('Content-Type: image/png');

// Output the image
echo $result->getString();
