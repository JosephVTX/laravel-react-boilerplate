<?php

namespace Tests\Concerns;

use App\Crud\CrudDefinition;
use App\Crud\CrudRegistry;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Suite estandar para CUALQUIER recurso de config/crud.php. Uso (la clase debe usar RefreshDatabase):
 *
 *   class ProductCrudTest extends TestCase {
 *       use RefreshDatabase, CrudResourceTests;
 *       protected function crudSlug(): string { return 'products'; }
 *       protected function validPayload(): array { return ['name' => 'Cafe']; }
 *   }
 *
 * Cubre: autenticacion, permisos (403), listado Inertia, crear, validacion, editar y eliminar.
 * `make:crud` genera esta clase automaticamente; agrega tests propios solo para reglas de negocio especificas.
 */
trait CrudResourceTests
{
    abstract protected function crudSlug(): string;

    /** @return array<string, mixed> Payload valido para crear. */
    abstract protected function validPayload(): array;

    /** @return array<string, mixed> Payload que DEBE fallar la validacion (por defecto: vacio). */
    protected function invalidPayload(): array
    {
        return [];
    }

    /** @return array<string, mixed> Payload para editar (por defecto igual al de crear). */
    protected function updatePayload(): array
    {
        return $this->validPayload();
    }

    /** Registro existente para editar/borrar. Sobrescribir si el modelo no tiene factory. */
    protected function existingRecord(): Model
    {
        return $this->crudDefinition()->model()::factory()->create();
    }

    protected function crudDefinition(): CrudDefinition
    {
        return app(CrudRegistry::class)->get($this->crudSlug());
    }

    private function crudAdmin(): User
    {
        $this->artisan('crud:sync');

        return User::factory()->create()->assignRole(config('crud.admin_role'));
    }

    private function crudUrl(string|int|null $id = null): string
    {
        return '/'.$this->crudSlug().($id === null ? '' : "/{$id}");
    }

    public function test_crud_requires_authentication(): void
    {
        $this->get($this->crudUrl())->assertRedirect('/login');
    }

    public function test_crud_forbids_users_without_permission(): void
    {
        $this->artisan('crud:sync');

        $this->actingAs(User::factory()->create()->assignRole('user'))
            ->get($this->crudUrl())
            ->assertForbidden();
    }

    public function test_crud_index_renders_meta_and_rows(): void
    {
        $admin = $this->crudAdmin();
        $this->existingRecord();

        $this->actingAs($admin)->get($this->crudUrl())->assertInertia(fn (Assert $page) => $page
            ->component('crud/index')
            ->where('meta.slug', $this->crudSlug())
            ->where('meta.canCreate', true)
            ->has('meta.columns')
            ->has('meta.fields')
            ->where('rows.meta.total', fn ($total) => $total >= 1));
    }

    public function test_crud_store_creates_a_record(): void
    {
        $admin = $this->crudAdmin();
        $model = $this->crudDefinition()->model();
        $before = $model::query()->count();

        $this->actingAs($admin)->post($this->crudUrl(), $this->validPayload())
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $this->assertSame($before + 1, $model::query()->count());
    }

    public function test_crud_store_validates_input(): void
    {
        $admin = $this->crudAdmin();
        $model = $this->crudDefinition()->model();
        $before = $model::query()->count();

        $this->actingAs($admin)->post($this->crudUrl(), $this->invalidPayload())->assertSessionHasErrors();

        $this->assertSame($before, $model::query()->count());
    }

    public function test_crud_update_modifies_the_record(): void
    {
        $admin = $this->crudAdmin();
        $record = $this->existingRecord();

        $this->actingAs($admin)->put($this->crudUrl($record->getKey()), $this->updatePayload())
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $record->refresh();
        foreach ($this->updatePayload() as $key => $value) {
            if (is_scalar($value) && array_key_exists($key, $record->getAttributes()) && ! in_array($key, $record->getHidden(), true)) {
                $this->assertEquals($value, $record->getAttribute($key), "El campo {$key} no se actualizo.");
            }
        }
    }

    public function test_crud_destroy_deletes_the_record(): void
    {
        $admin = $this->crudAdmin();
        $record = $this->existingRecord();

        $this->actingAs($admin)->delete($this->crudUrl($record->getKey()));

        $this->assertModelMissing($record);
    }
}
