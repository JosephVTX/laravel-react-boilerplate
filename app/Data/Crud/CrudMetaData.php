<?php

namespace App\Data\Crud;

use Spatie\LaravelData\Data;

/** Descripcion completa de un recurso CRUD: la pagina generica se dibuja solo con esto. */
class CrudMetaData extends Data
{
    /**
     * @param  ColumnData[]  $columns
     * @param  FieldData[]  $fields
     */
    public function __construct(
        public string $slug,
        public string $label,
        public string $singular,
        public string $baseUrl,
        public array $columns,
        public array $fields,
        public bool $searchable,
        public bool $canCreate,
        public bool $canUpdate,
        public bool $canDelete,
        public string $defaultSort,
    ) {}
}
