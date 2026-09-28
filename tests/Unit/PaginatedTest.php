<?php

namespace Tests\Unit;

use App\Data\Crud\OptionData;
use App\Support\Paginated;
use Illuminate\Pagination\LengthAwarePaginator;
use Tests\TestCase;

class PaginatedTest extends TestCase
{
    public function test_contract_shape_matches_frontend_type(): void
    {
        $paginator = new LengthAwarePaginator(
            [new OptionData('a', 'Alfa'), new OptionData('b', 'Beta')],
            total: 12,
            perPage: 2,
            currentPage: 3,
        );

        $page = Paginated::from($paginator);

        $this->assertSame([['value' => 'a', 'label' => 'Alfa'], ['value' => 'b', 'label' => 'Beta']], $page['data']);
        $this->assertSame(
            ['current_page' => 3, 'last_page' => 6, 'per_page' => 2, 'total' => 12, 'from' => 5, 'to' => 6],
            $page['meta'],
        );
    }
}
