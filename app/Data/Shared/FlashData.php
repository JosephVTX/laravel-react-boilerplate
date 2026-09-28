<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Data;

class FlashData extends Data
{
    public function __construct(
        public ?string $success = null,
        public ?string $error = null,
    ) {}
}
