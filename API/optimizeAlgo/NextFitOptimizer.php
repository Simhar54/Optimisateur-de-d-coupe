<?php
// NextFitOptimizer.php

/**
 * Classe NextFitOptimizer pour optimiser la découpe de barres en utilisant la stratégie du "prochain ajustement"
 * tout en priorisant les plus petites barres disponibles pour minimiser les déchets.
 */
class NextFitOptimizer
{
    private $minDropLength; // La longueur minimale de chute qui doit être laissé sur chaque barre.
    private $sawBladeSize; // La taille de la lame de scie, qui réduit la longueur utilisable de la barre à chaque coupe.

    /**
     * Constructeur de la classe.
     * @param int $minDropLength Longueur minimale de chute de barre.
     * @param int $sawBladeSize Taille de la lame de scie utilisée pour les coupes.
     */
    public function __construct($minDropLength, $sawBladeSize)
    {
        $this->minDropLength = $minDropLength;
        $this->sawBladeSize = $sawBladeSize;
    }

    /**
     * Méthode pour optimiser les découpes des barres selon les demandes spécifiées.
     * @param array $barLengths Les longueurs des barres disponibles.
     * @param array $cutRequests Les demandes de coupes contenant les longueurs nécessaires et d'autres détails.
     * @return array Retourne un tableau des barres avec les coupes réalisées et les restes.
     */
    public function optimize($barLengths, $cutRequests)
    {
        $bins = []; // Tableau pour stocker les résultats des découpes.
        $currentBinIndex = -1; // Index pour suivre la barre courante utilisée pour les découpes.

        // Trie les barres par longueur en ordre croissant pour prioriser les petites barres.
        usort($barLengths, function ($a, $b) {
            return $a->length <=> $b->length;
        });

        // Parcourir toutes les demandes de coupe.
        foreach ($cutRequests as $request) {
            $fitFound = false;
            // Vérifier la capacité de la barre courante à accueillir la coupe.
            if ($currentBinIndex != -1 && $bins[$currentBinIndex]['remainder'] >= $request->cutLength + $this->sawBladeSize + $this->minDropLength) {
                // Coupe dans la barre courante.
                $bins[$currentBinIndex]['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
                $bins[$currentBinIndex]['remainder'] -= ($request->cutLength + $this->sawBladeSize);
                $fitFound = true;
            }

            // Si la coupe ne peut pas être réalisée dans la barre courante, chercher une nouvelle barre.
            if (!$fitFound) {
                foreach ($barLengths as $key => $bar) {
                    if ($bar->length >= $request->cutLength + $this->sawBladeSize + $this->minDropLength) {
                        // Création d'un nouveau "bin" avec cette barre.
                        $bins[] = [
                            'barId' => $bar->id,
                            'initialLength' => $bar->length,
                            'cuts' => [['length' => $request->cutLength, 'of' => $request->of]],
                            'remainder' => $bar->length - ($request->cutLength + $this->sawBladeSize),
                        ];
                        unset($barLengths[$key]); // Retirer la barre des barres disponibles.
                        $currentBinIndex++; // Mettre à jour l'index de la barre courante.
                        $fitFound = true;
                        break;
                    }
                }
            }

            // Si aucune barre n'est trouvée, passer à la prochaine demande.
        }

        // Ajouter les barres restantes comme non utilisées au tableau final.
        foreach ($barLengths as $bar) {
            $bins[] = [
                'barId' => $bar->id,
                'initialLength' => $bar->length,
                'cuts' => [],
                'remainder' => $bar->length,
            ];
        }

        return $bins; // Retourner le tableau final des résultats de découpe.

    }
}
