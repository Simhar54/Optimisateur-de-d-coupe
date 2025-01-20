<?php
// DynamicFitOptimizer.php

/**
 * La classe DynamicBestFitOptimizer est conçue pour optimiser la découpe de barres en utilisant une stratégie de programmation dynamique
 * pour minimiser les déchets et utiliser efficacement les restes de barre.
 */
class DynamicFitOptimizer {
    private $minDropLength; // La longueur minimale de chute qui doit être laissée sur chaque barre.
    private $sawBladeSize; // Taille de la lame de scie, à considérer dans le calcul de la longueur coupée.
    private $memo; // Tableau de mémoire pour stocker les solutions optimales pour différentes configurations.

    /**
     * Constructeur de la classe.
     * @param int $minDropLength Longueur minimale de chute de barre.
     * @param int $sawBladeSize Taille de la lame de scie utilisée pour les coupes.
     */
    public function __construct($minDropLength, $sawBladeSize) {
        $this->minDropLength = $minDropLength;
        $this->sawBladeSize = $sawBladeSize;
        $this->memo = [];
    }

    /**
     * Fonction pour optimiser les coupes de barres.
     * @param array $barLengths Liste des barres disponibles avec leurs longueurs.
     * @param array $cutRequests Demandes de coupes spécifiant les longueurs nécessaires et autres détails.
     * @return array Retourne un tableau des barres avec les coupes effectuées et les restes.
     */
    public function optimize($barLengths, $cutRequests) {
        // Trier les demandes de coupe par longueur décroissante.
        usort($cutRequests, function($a, $b) {
            return $b->cutLength <=> $a->cutLength;
        });

        $bins = $this->initializeBins($barLengths);

        foreach ($cutRequests as $request) {
            $this->fitCut($bins, $request, $barLengths);
        }

        // Filtre et retourne uniquement les barres qui ont été utilisées pour des coupes ou qui sont restées intactes.
        return array_values(array_filter($bins, function($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }

    /**
     * Fonction pour ajuster la coupe dans la meilleure barre possible.
     * @param array &$bins Référence au tableau des barres disponibles
     * @param object $request Demande de coupe
     * @param array &$barLengths Liste des barres disponibles
     */
    private function fitCut(&$bins, $request, &$barLengths) {
        $bestFitIndex = null;
        $bestFitRemainder = PHP_INT_MAX;
        foreach ($bins as $index => &$bin) {
            $possibleRemainder = $bin['remainder'] - ($request->cutLength + $this->sawBladeSize);
            // Vérifie si la barre peut accueillir la coupe tout en laissant une chute supérieure à la longueur minimale acceptée.
            if ($possibleRemainder >= $this->minDropLength && $possibleRemainder < $bestFitRemainder) {
                $bestFitIndex = $index;
                $bestFitRemainder = $possibleRemainder;
            }
        }
        unset($bin);

        // Si une barre a été sélectionnée, effectue la coupe et met à jour la longueur restante.
        if (isset($bestFitIndex)) {
            $bins[$bestFitIndex]['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
            $bins[$bestFitIndex]['remainder'] -= ($request->cutLength + $this->sawBladeSize);
        } else {
            // Si aucune barre existante ne peut accueillir la coupe, créer une nouvelle barre.
            $newBar = array_shift($barLengths);
            if ($newBar) {
                $bins[$newBar->id] = [
                    'barId' => $newBar->id,
                    'initialLength' => $newBar->length,
                    'cuts' => [['length' => $request->cutLength, 'of' => $request->of]],
                    'remainder' => $newBar->length - ($request->cutLength + $this->sawBladeSize),
                ];
            }
        }

        // Ré-ordonne les bins pour continuer à privilégier les barres avec le moins de matière restante.
        uasort($bins, function($a, $b) {
            return $a['remainder'] <=> $b['remainder'];
        });
    }

    /**
     * Initialiser les barres avec leurs longueurs.
     * @param array $barLengths Liste des barres disponibles avec leurs longueurs.
     * @return array Tableau des barres initialisé.
     */
    private function initializeBins($barLengths) {
        $bins = [];
        foreach ($barLengths as $bar) {
            $bins[$bar->id] = [
                'barId' => $bar->id,
                'initialLength' => $bar->length,
                'cuts' => [],
                'remainder' => $bar->length,
            ];
        }
        return $bins;
    }

   
}

