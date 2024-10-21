<?php
// Inclusion des fichiers contenant les algorithmes d'optimisation

require_once 'optimizeAlgo/DynamicFitOptimzer.php';

// Définition du type de contenu de la réponse HTTP
header("Content-Type: application/json");

// Récupération et décodage des données JSON envoyées dans la requête
$json = file_get_contents('php://input');
$data = json_decode($json);

// Extraction des données nécessaires à partir des données JSON
$barLengths = $data->barLengths;
$cutRequests = $data->cutLengths;
$minDropLength = (int)$data->barDrop;
$sawBladeSize = (int)$data->sawBladeSize;

// Tri des barres par longueur croissante
usort($barLengths, function ($a, $b) {
    return $a->length - $b->length;
});

$optimizerDynamicFit = new DynamicFitOptimizer($minDropLength, $sawBladeSize);




$resultsDynamicFit = $optimizerDynamicFit->optimize($barLengths, $cutRequests);


// Construction et envoi de la réponse JSON
$response = [
    'status' => 'success',
    'message' => 'Optimisation réalisée avec succès.',
    'results' => $resultsDynamicFit
];

echo json_encode($response);
