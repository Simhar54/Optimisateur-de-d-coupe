<?php
// FirstFitOptimizer.php

/**
 * La classe FirstFitOptimizer est conçue pour optimiser les découpes dans des barres de matériaux
 * en utilisant la stratégie du "premier ajustement" tout en priorisant les petites barres.
 */
class FirstFitOptimizer {
    private $minDropLength; // La longueur minimale de chute qui doit être laissé sur chaque barre.
    private $sawBladeSize; // La taille de la lame de scie, qui sera soustraite de chaque coupe.

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
     * Optimise les découpes des barres selon les demandes spécifiées.
     * @param array $barLengths Les longueurs des barres disponibles.
     * @param array $cutRequests Les demandes de coupes contenant les longueurs nécessaires.
     * @return array Retourne un tableau des barres avec les coupes réalisées et les restes.
     */
    public function optimize($barLengths, $cutRequests) {
        $bins = [];
        foreach ($barLengths as $bar) {
            $bins[$bar->id] = [
                'barId' => $bar->id,
                'initialLength' => $bar->length,
                'cuts' => [],
                'remainder' => $bar->length,
            ];
        }

        // Trie les barres par longueur restante en ordre croissant pour privilégier l'utilisation des petites barres.
        uasort($bins, function($a, $b) {
            return $a['remainder'] <=> $b['remainder'];
        });

        foreach ($cutRequests as $request) {
            foreach ($bins as &$bin) {
                // Vérifie si la barre peut accommoder la coupe tout en respectant la taille minimale de la chute.
                if ($bin['remainder'] >= $request->cutLength + $this->sawBladeSize && ($bin['remainder'] - ($request->cutLength + $this->sawBladeSize) >= $this->minDropLength || $bin['remainder'] - ($request->cutLength + $this->sawBladeSize) == 0)) {
                    $bin['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
                    $bin['remainder'] -= ($request->cutLength + $this->sawBladeSize);
                    break; // Sort de la boucle une fois la coupe effectuée pour cette demande.
                }
            }
            unset($bin);
        }

        // Filtre et retourne uniquement les barres qui ont été utilisées pour des coupes ou qui sont restées intactes.
        return array_values(array_filter($bins, function($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }
}
