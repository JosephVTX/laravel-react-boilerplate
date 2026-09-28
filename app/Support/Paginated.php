<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\LaravelData\Data;

/** Contrato unico de paginacion. Su tipo TS es `Paginated<T>` en resources/js/types/index.ts. */
final class Paginated
{
    /** @return array{data: list<array<string, mixed>>, meta: array<string, int|null>} */
    public static function from(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => collect($paginator->items())
                ->map(fn (mixed $item) => $item instanceof Data ? $item->toArray() : (array) $item)
                ->values()
                ->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ];
    }
}
