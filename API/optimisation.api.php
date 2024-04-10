<?php
// Assurez-vous que le chemin vers FirstFitOptimizer.php est correct
require_once 'optimizeAlgo/FirstFitOptimizer.php';
require_once 'optimizeAlgo/BestFitOptimizer.php';
require_once 'optimizeAlgo/NextFitOptimizer.php';

header("Content-Type: application/json");

$json = file_get_contents('php://input');
$data = json_decode($json);

$barLengths = $data->barLengths;
$cutRequests = $data->cutLengths;
$minDropLength = (int)$data->barDrop;
$sawBladeSize = (int)$data->sawBladeSize;

// Instanciation de l'optimiseur FirstFit
$optimizerFirstFit = new FirstFitOptimizer($minDropLength, $sawBladeSize);
$opimizerBestFit = new BestFitOptimizer($minDropLength, $sawBladeSize);
$optimizerNextFit = new NextFitOptimizer($minDropLength, $sawBladeSize);

// Exécution de l'optimisation
$resultsFirstFit = $optimizerFirstFit->optimize($barLengths, $cutRequests);
$resultsBestFit = $opimizerBestFit->optimize($barLengths, $cutRequests);
$resultsNextFit = $optimizerNextFit->optimize($barLengths, $cutRequests);


// Construction et envoi de la réponse
$response = [
    'status' => 'success',
    'message' => 'Optimisation réalisée avec succès.',
    'results' => [$resultsFirstFit, $resultsBestFit, $resultsNextFit]
];

echo json_encode($response);
?>
