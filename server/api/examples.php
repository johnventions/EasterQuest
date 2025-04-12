<?

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
require_once __DIR__ . '/../vendor/autoload.php';
include "./data/findIts.php";
include "./data/playIts.php";


    $result = array_merge($findIts, $playIts);
    echo json_encode( $result );
?>
