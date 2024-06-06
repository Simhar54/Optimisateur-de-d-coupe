<?php
// DynamicCutOptimizer.php

/**
 * La classe DynamicCutOptimizer est conçue pour optimiser la découpe de barres en utilisant une combinaison
 * de la stratégie du "meilleur ajustement" et de la programmation dynamique pour minimiser les déchets
 * tout en utilisant efficacement les restes de barres.
 */
class DynamicCutOptimizer
{
    private $minDropLength;
    private $sawBladeSize;

    public function __construct($minDropLength, $sawBladeSize)
    {
        $this->minDropLength = (int)$minDropLength;
        $this->sawBladeSize = (int)$sawBladeSize;
    }

    public function optimize($barLengths, $cutRequests)
    {
        $bins = [];
        foreach ($barLengths as $bar) {
            $bins[$bar->id] = [
                'barId' => $bar->id,
                'initialLength' => (int)$bar->length,
                'cuts' => [],
                'remainder' => (int)$bar->length,
            ];
        }

        foreach ($barLengths as $bar) {
            $optimizedCuts = $this->dynamicOptimization($cutRequests, (int)$bar->length);
            foreach ($optimizedCuts as $cut) {
                $bins[$bar->id]['cuts'][] = ['length' => (int)$cut->cutLength, 'of' => $cut->of];
                $bins[$bar->id]['remainder'] -= ((int)$cut->cutLength + $this->sawBladeSize);

                foreach ($cutRequests as $key => $request) {
                    if ($request->cutLength == $cut->cutLength && $request->of == $cut->of) {
                        unset($cutRequests[$key]);
                        break;
                    }
                }

                $cutRequests = array_values($cutRequests);
            }
        }

        uasort($bins, function ($a, $b) {
            return $a['remainder'] <=> $b['remainder'];
        });

        $remainingRequests = $cutRequests;

        foreach ($remainingRequests as $request) {
            $bestFitIndex = null;
            $bestFitRemainder = PHP_INT_MAX;
            foreach ($bins as $index => &$bin) {
                $possibleRemainder = $bin['remainder'] - ((int)$request->cutLength + $this->sawBladeSize);
                if ($possibleRemainder >= $this->minDropLength && $possibleRemainder < $bestFitRemainder) {
                    $bestFitIndex = $index;
                    $bestFitRemainder = $possibleRemainder;
                }
            }
            unset($bin);

            if (isset($bestFitIndex)) {
                $bins[$bestFitIndex]['cuts'][] = ['length' => (int)$request->cutLength, 'of' => $request->of];
                $bins[$bestFitIndex]['remainder'] -= ((int)$request->cutLength + $this->sawBladeSize);

                foreach ($cutRequests as $key => $request) {
                    if ($request->cutLength == $cut->cutLength && $request->of == $cut->of) {
                        unset($cutRequests[$key]);
                        break;
                    }
                }
            } else {
                error_log("Aucune barre ne peut accueillir la coupe de longueur : {$request->cutLength}");
            }

            uasort($bins, function ($a, $b) {
                return $a['remainder'] <=> $b['remainder'];
            });
        }

        return array_values(array_filter($bins, function ($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }

    private function dynamicOptimization($cutRequests, $barLength)
    {
        $n = count($cutRequests);
        $dp = array_fill(0, $barLength + 1, PHP_INT_MAX);
        $dp[0] = 0;
        $cutUsed = array_fill(0, $barLength + 1, -1);

        for ($i = 1; $i <= $barLength; $i++) {
            foreach ($cutRequests as $index => $request) {
                $cutLength = (int)$request->cutLength + $this->sawBladeSize;
                if ($i >= $cutLength && $dp[$i - $cutLength] != PHP_INT_MAX) {
                    if ($dp[$i] > $dp[$i - $cutLength] + 1) {
                        $dp[$i] = $dp[$i - $cutLength] + 1;
                        $cutUsed[$i] = $index;
                    }
                }
            }
        }

        if ($dp[$barLength] == PHP_INT_MAX) {
            return [];
        }

        $solution = [];
        while ($barLength > 0) {
            $index = $cutUsed[$barLength];
            if ($index == -1) {
                break;
            }
            $request = $cutRequests[$index];
            $cutLength = (int)$request->cutLength + $this->sawBladeSize;
            $solution[] = $request;
            $barLength -= $cutLength;
        }

        return $solution;
    }
}
