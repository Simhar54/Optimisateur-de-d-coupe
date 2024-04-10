<?php
// FirstFitOptimizer.php

class FirstFitOptimizer {
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
            foreach ($bins as &$bin) {
                if ($bin['remainder'] >= $request->cutLength + $this->sawBladeSize && ($bin['remainder'] - ($request->cutLength + $this->sawBladeSize) >= $this->minDropLength || $bin['remainder'] - ($request->cutLength + $this->sawBladeSize) == 0)) {
                    $bin['cuts'][] = ['length' => $request->cutLength, 'of' => $request->of];
                    $bin['remainder'] -= ($request->cutLength + $this->sawBladeSize);
                    break;
                }
            }
            unset($bin);
        }

        return array_values(array_filter($bins, function($bin) {
            return !empty($bin['cuts']) || $bin['remainder'] == $bin['initialLength'];
        }));
    }
}
