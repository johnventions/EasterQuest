<?
    include "./data/findIts.php";

    header('Content-Type: application/json');
    echo json_encode( $findIts );

?>
