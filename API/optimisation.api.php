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

function findBestResult($resultsBestFit, $resultsFirstFit, $resultsNextFit) {
    $resultTab = [$resultsBestFit, $resultsFirstFit, $resultsNextFit];

    function testBar($result) {
        $unusedBar = 0;
        $longestRemainder = 0;
        $remaindedTab = [];

        foreach ($result as $bar) {
            if (empty($bar['cuts'])) {
                $unusedBar++;
            }
            array_push($remaindedTab, $bar['remainder']);
        }

        if (!empty($remaindedTab)) {
            $longestRemainder = max($remaindedTab);
        }

        return ['unusedBar' => $unusedBar, 'longestRemainder' => $longestRemainder];
    }

    function bestResult($resultTab) {
        $bestResult = $resultTab[0];
        foreach ($resultTab as $result) {
            $testBar = testBar($result);
            $testBestBar = testBar($bestResult);
            if ($testBar['unusedBar'] > $testBestBar['unusedBar']) {
                $bestResult = $result;
            } elseif ($testBar['unusedBar'] == $testBestBar['unusedBar']) {
                if ($testBar['longestRemainder'] > $testBestBar['longestRemainder']) {
                    $bestResult = $result;
                }
            }
        }
        return $bestResult;
    }

    return bestResult($resultTab);
}


$bestResult = findBestResult($resultsBestFit ,$resultsFirstFit, $resultsNextFit);


// Construction et envoi de la réponse
$response = [
    'status' => 'success',
    'message' => 'Optimisation réalisée avec succès.',
    'results' => $bestResult
];

echo json_encode($response);
