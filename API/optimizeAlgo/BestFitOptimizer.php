<?php
// BestFitOptimizer.php

class BestFitOptimizer {
    private $minDropLength;
    private $sawBladeSize;

    public function __construct($minDropLength, $sawBladeSize) {
        $this->minDropLength = $minDropLength;
        $this->sawBladeSize = $sawBladeSize;
    }

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

        foreach ($cutRequests as $request) {
            $bestFitIndex = null;
            $bestFitRemainder = PHP_INT_MAX;
            foreach ($bins as $index => &$bin) {
                $possibleRemainder = $bin['remainder'] - ($request->cutLength + $this->sawBladeSize);
                if ($possibleRemainder >= $this->minDropLength && $possibleRemainder < $bestFitRemainder) {
                    $bestFitIndex = $index;
                    $bestFitRemainder = $possibleRemainder;
                }
            }
            unset($bin);

            if (isset($bestFitIndex)) {
                $bins[$bestFitIndex]['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
                $bins[$bestFitIndex]['remainder'] -= ($request->cutLength + $this->sawBladeSize);
            }
        }

        return array_values(array_filter($bins, function($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }
}
