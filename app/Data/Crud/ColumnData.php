<?php

namespace App\Data\Crud;

use App\Enums\ColumnType;
use Spatie\LaravelData\Data;

class ColumnData extends Data
{
    public function __construct(
        public string $key,
        public string $label,
        public ColumnType $type,
        public bool $sortable,
    ) {}
}
