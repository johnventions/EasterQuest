<?
    header('Content-Type: application/json');
    
    include "./data/findIts.php";

    echo json_encode( $findIts );

?>
