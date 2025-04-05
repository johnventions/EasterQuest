<?
    header('Content-Type: application/json');
    
    require_once __DIR__ . '/../vendor/autoload.php';
    include "./data/findIts.php";
    include "./data/playIts.php";


    $result = array_merge($findIts, $playIts);
    echo json_encode( $result );
?>
