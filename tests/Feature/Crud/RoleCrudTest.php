<?php

namespace Tests\Feature\Crud;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\Concerns\CrudResourceTests;
use Tests\TestCase;

class RoleCrudTest extends TestCase
{
    use CrudResourceTests, RefreshDatabase;

    protected function crudSlug(): string
    {
        return 'roles';
    }

    protected function validPayload(): array
    {
        return ['name' => 'editor', 'permissions' => ['users.view']];
    }

    protected function updatePayload(): array
    {
        return ['name' => 'editor-renombrado', 'permissions' => []];
    }

    /** Spatie Role no tiene factory. */
    protected function existingRecord(): Model
    {
        return Role::create(['name' => 'temporal']);
    }
}
