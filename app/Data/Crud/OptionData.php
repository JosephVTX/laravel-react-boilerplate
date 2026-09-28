<?php

namespace App\Data\Crud;

use Spatie\LaravelData\Data;

class OptionData extends Data
{
    public function __construct(
        public string $value,
        public string $label,
    ) {}
}
