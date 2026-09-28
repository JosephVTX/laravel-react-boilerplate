<?php

namespace App\Enums;

/** Tipos de columna soportados por la tabla CRUD generica (resources/js/components/crud/CellValue.tsx). */
enum ColumnType: string
{
    case Text = 'text';
    case Badge = 'badge';
    case Badges = 'badges';
    case Boolean = 'boolean';
    case Date = 'date';
    case DateTime = 'datetime';
}
