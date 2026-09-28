<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('crud:sync');
    }

    private function admin(): User
    {
        return User::factory()->create()->assignRole(config('crud.admin_role'));
    }

    public function test_index_returns_meta_rows_and_query_state(): void
    {
        $admin = $this->admin();
        User::factory(3)->create();

        $this->actingAs($admin)
            ->get('/users?sort=name&filter[search]=zzzz-none')
            ->assertInertia(fn (Assert $page) => $page
                ->component('crud/index')
                ->where('meta.slug', 'users')
                ->where('meta.canCreate', true)
                ->has('meta.columns', 4)
                ->where('rows.meta.total', 0)
                ->where('query.search', 'zzzz-none')
                ->where('query.sort', 'name'));
    }

    public function test_search_and_sort_use_query_builder(): void
    {
        $admin = $this->admin();
        User::factory()->create(['name' => 'Zeta Buscable']);

        $this->actingAs($admin)
            ->get('/users?filter[search]=Buscable')
            ->assertInertia(fn (Assert $page) => $page
                ->where('rows.meta.total', 1)
                ->where('rows.data.0.name', 'Zeta Buscable'));

        // Columna no ordenable => query-builder responde 400.
        $this->actingAs($admin)->get('/users?sort=password')->assertStatus(400);
    }

    public function test_create_update_and_delete_a_user_with_roles(): void
    {
        $admin = $this->admin();
        Role::findOrCreate('user');

        $this->actingAs($admin)->post('/users', [
            'name' => 'Nuevo',
            'email' => 'nuevo@example.com',
            'password' => 'secret-123',
            'roles' => ['user'],
        ])->assertSessionHasNoErrors()->assertRedirect();

        $user = User::where('email', 'nuevo@example.com')->firstOrFail();
        $this->assertTrue($user->hasRole('user'));

        // Password vacio al editar => no cambia.
        $hash = $user->password;
        $this->actingAs($admin)->put("/users/{$user->id}", [
            'name' => 'Renombrado',
            'email' => 'nuevo@example.com',
            'password' => '',
            'roles' => [],
        ])->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertSame('Renombrado', $user->name);
        $this->assertSame($hash, $user->password);
        $this->assertFalse($user->hasRole('user'));

        $this->actingAs($admin)->delete("/users/{$user->id}")->assertRedirect();
        $this->assertModelMissing($user);
    }

    public function test_validation_errors_are_returned(): void
    {
        $this->actingAs($this->admin())
            ->post('/users', ['name' => '', 'email' => 'no-es-correo'])
            ->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_cannot_delete_yourself(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->delete("/users/{$admin->id}")->assertSessionHas('error');
        $this->assertModelExists($admin);
    }

    public function test_roles_resource_creates_role_with_permissions(): void
    {
        $this->actingAs($this->admin())->post('/roles', [
            'name' => 'editor',
            'permissions' => ['users.view'],
        ])->assertSessionHasNoErrors();

        $role = Role::findByName('editor');
        $this->assertTrue($role->hasPermissionTo('users.view'));
    }

    public function test_shared_props_include_navigation_and_permissions(): void
    {
        $this->actingAs($this->admin())
            ->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('navigation', 2)
                ->where('auth.user.email', fn ($email) => is_string($email))
                ->has('auth.permissions', 8));
    }

    public function test_me_endpoint_returns_typed_json(): void
    {
        $this->actingAs($this->admin())
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'roles', 'created_at'], 'permissions']);
    }
}
