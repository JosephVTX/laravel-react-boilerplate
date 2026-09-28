<?php

namespace Tests\Feature\Crud;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CrudResourceTests;
use Tests\TestCase;

class UserCrudTest extends TestCase
{
    use CrudResourceTests, RefreshDatabase;

    protected function crudSlug(): string
    {
        return 'users';
    }

    protected function validPayload(): array
    {
        return ['name' => 'Persona Nueva', 'email' => 'nueva@example.com', 'password' => 'clave-segura-1', 'roles' => []];
    }

    protected function updatePayload(): array
    {
        return ['name' => 'Persona Editada', 'email' => 'editada@example.com', 'password' => '', 'roles' => []];
    }

    // El admin autenticado no puede borrarse a si mismo, asi que el registro a borrar es otro usuario (factory por defecto).
}
