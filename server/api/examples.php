<?
    header('Content-Type: application/json');
    
    require_once __DIR__ . '/../vendor/autoload.php';
    include "./data/findIts.php";

    echo json_encode( $findIts );
?>
