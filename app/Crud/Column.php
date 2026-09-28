<?php

namespace App\Crud;

use App\Data\Crud\ColumnData;
use App\Enums\ColumnType;

/** Builder fluido de columnas. Solo `toData()` viaja al frontend; `searchable` es solo backend. */
final class Column
{
    private bool $sortable = false;

    private bool $searchable = false;

    private function __construct(
        public readonly string $key,
        private readonly string $label,
        private readonly ColumnType $type,
    ) {}

    public static function make(string $key, string $label, ColumnType $type = ColumnType::Text): self
    {
        return new self($key, $label, $type);
    }

    public function sortable(): self
    {
        $this->sortable = true;

        return $this;
    }

    /** Incluye la columna (debe ser una columna real de BD) en el filtro `search`. */
    public function searchable(): self
    {
        $this->searchable = true;

        return $this;
    }

    public function isSortable(): bool
    {
        return $this->sortable;
    }

    public function isSearchable(): bool
    {
        return $this->searchable;
    }

    public function toData(): ColumnData
    {
        return new ColumnData($this->key, $this->label, $this->type, $this->sortable);
    }
}
