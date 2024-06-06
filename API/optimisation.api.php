<?php
// Inclusion des fichiers contenant les algorithmes d'optimisation
require_once 'optimizeAlgo/FirstFitOptimizer.php';
require_once 'optimizeAlgo/BestFitOptimizer.php';
require_once 'optimizeAlgo/NextFitOptimizer.php';
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

// Instanciation des différents optimiseurs
$optimizerFirstFit = new FirstFitOptimizer($minDropLength, $sawBladeSize);
$opimizerBestFit = new BestFitOptimizer($minDropLength, $sawBladeSize);
$optimizerNextFit = new NextFitOptimizer($minDropLength, $sawBladeSize);
$optimizerDynamicFit = new DynamicFitOptimizer($minDropLength, $sawBladeSize);



// Exécution des optimisations avec chaque algorithme
$resultsFirstFit = $optimizerFirstFit->optimize($barLengths, $cutRequests);
$resultsBestFit = $opimizerBestFit->optimize($barLengths, $cutRequests);
$resultsNextFit = $optimizerNextFit->optimize($barLengths, $cutRequests);
$resultsDynamicFit = $optimizerDynamicFit->optimize($barLengths, $cutRequests);


/**
 * Trouve le meilleur résultat parmi les trois algorithmes d'optimisation.
 *
 * @param array $resultsBestFit Résultats de l'optimisation avec BestFit.
 * @param array $resultsFirstFit Résultats de l'optimisation avec FirstFit.
 * @param array $resultsNextFit Résultats de l'optimisation avec NextFit.
 * @return array Le meilleur résultat basé sur les critères définis.
 */
function findBestResult($resultsBestFit, $resultsFirstFit, $resultsNextFit)
{
    $resultTab = [$resultsBestFit, $resultsFirstFit, $resultsNextFit];

    /**
     * Évalue les barres pour déterminer le nombre de barres inutilisées et la plus grande chute restante.
     *
     * @param array $result Résultats d'un algorithme d'optimisation.
     * @return array Nombre de barres inutilisées et la plus grande chute restante.
     */
    function testBar($result)
    {
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

    /**
     * Compare les résultats pour trouver le meilleur basé sur les barres inutilisées et la plus grande chute restante.
     *
     * @param array $resultTab Tableau des résultats des différents algorithmes.
     * @return array Le meilleur résultat.
     */
    function bestResult($resultTab)
    {
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

// Recherche du meilleur résultat parmi les résultats obtenus par chaque optimiseur
$bestResult = findBestResult($resultsBestFit, $resultsFirstFit, $resultsNextFit);

// Construction et envoi de la réponse JSON
$response = [
    'status' => 'success',
    'message' => 'Optimisation réalisée avec succès.',
    'results' => $resultsDynamicFit
];

echo json_encode($response);
