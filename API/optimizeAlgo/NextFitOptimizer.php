<?php
// NextFitOptimizer.php

// Classe NextFitOptimizer pour optimiser la découpe de barres
class NextFitOptimizer {
    private $minDropLength; // Longueur minimale restante après découpe
    private $sawBladeSize; // Taille de la lame de scie

    // Constructeur de la classe
    public function __construct($minDropLength, $sawBladeSize) {
        $this->minDropLength = $minDropLength;
        $this->sawBladeSize = $sawBladeSize;
    }

    // Méthode pour optimiser la découpe de barres
    public function optimize($barLengths, $cutRequests) {
        $bins = []; // Tableau pour stocker les informations de découpe
        $currentBinIndex = -1; // Index de la barre courante

        // Parcourir toutes les demandes de coupe
        foreach ($cutRequests as $request) {
            // Si c'est la première coupe ou que la coupe actuelle ne peut pas tenir dans la barre courante
            if ($currentBinIndex == -1 || $bins[$currentBinIndex]['remainder'] < $request->cutLength + $this->sawBladeSize) {
                // Trouver une nouvelle barre
                foreach ($barLengths as $key => $bar) {
                    // Vérifier si la barre peut contenir la coupe tout en respectant la longueur minimale restante
                    if ($bar->length >= $request->cutLength + $this->sawBladeSize + $this->minDropLength) {
                        // Créer un nouveau "bin" avec cette barre
                        $bins[] = [
                            'barId' => $bar->id,
                            'initialLength' => $bar->length,
                            'cuts' => [['length' => $request->cutLength, 'of' => $request->of]],
                            'remainder' => $bar->length - ($request->cutLength + $this->sawBladeSize),
                        ];
                        unset($barLengths[$key]); // Retirer la barre des barres disponibles
                        $currentBinIndex++; // Passer à la nouvelle barre
                        break;
                    }
                }
            } else {
                // Placer la coupe dans la barre courante
                $bins[$currentBinIndex]['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
                $bins[$currentBinIndex]['remainder'] -= ($request->cutLength + $this->sawBladeSize);
            }
        }

        // Inclure les barres restantes comme non utilisées
        foreach ($barLengths as $bar) {
            $bins[] = [
                'barId' => $bar->id,
                'initialLength' => $bar->length,
                'cuts' => [],
                'remainder' => $bar->length,
            ];
        }

        return $bins; // Retourner le tableau des informations de découpe
    }
}