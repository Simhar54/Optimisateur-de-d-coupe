<?php
// BestFitOptimizer.php

/**
 * La classe BestFitOptimizer est conçue pour optimiser la découpe de barres en utilisant la stratégie du "meilleur ajustement"
 * métalliques ou de bois, en minimisant les déchets tout en utilisant les restes de barre efficacement.
 */
class BestFitOptimizer {
    private $minDropLength; // LLa longueur minimale de chute qui doit être laissé sur chaque barre.
    private $sawBladeSize; // Taille de la lame de scie, à considérer dans le calcul de la longueur coupée.

    /**
     * Constructeur de la classe.
     * @param int $minDropLength Longueur minimale de chute de barre.
     * @param int $sawBladeSize Taille de la lame de scie utilisée pour les coupes.
     */
    public function __construct($minDropLength, $sawBladeSize) {
        $this->minDropLength = $minDropLength;
        $this->sawBladeSize = $sawBladeSize;
    }

    /**
     * Fonction pour optimiser les coupes de barres.
     * @param array $barLengths Liste des barres disponibles avec leurs longueurs.
     * @param array $cutRequests Demandes de coupes spécifiant les longueurs nécessaires et autres détails.
     * @return array Retourne un tableau des barres avec les coupes effectuées et les restes.
     */
    public function optimize($barLengths, $cutRequests) {
        $bins = []; // Initialisation du tableau pour stocker les informations de chaque barre.
        foreach ($barLengths as $bar) {
            $bins[$bar->id] = [
                'barId' => $bar->id,
                'initialLength' => $bar->length,
                'cuts' => [],
                'remainder' => $bar->length,
            ];
        }

        // Trie les barres par leur longueur restante en ordre croissant pour privilégier l'utilisation des plus petites d'abord.
        uasort($bins, function($a, $b) {
            return $a['remainder'] <=> $b['remainder'];
        });

        foreach ($cutRequests as $request) {
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
            }

            // Ré-ordonne les bins pour continuer à privilégier les barres avec le moins de matière restante.
            uasort($bins, function($a, $b) {
                return $a['remainder'] <=> $b['remainder'];
            });
        }

        // Filtre et retourne uniquement les barres qui ont été utilisées pour des coupes ou qui sont restées intactes.
        return array_values(array_filter($bins, function($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }
}
