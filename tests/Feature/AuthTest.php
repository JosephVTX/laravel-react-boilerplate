<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_logout(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/');
        $this->assertAuthenticatedAs($user);

        $this->post('/logout')->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'incorrecta'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_login_validates_payload_through_data_class(): void
    {
        $this->post('/login', ['email' => 'no-email', 'password' => 'x'])->assertSessionHasErrors('email');
    }

    public function test_registration_is_disabled_by_default(): void
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_registration_works_when_enabled(): void
    {
        config(['app.allow_registration' => true]);
        $this->artisan('crud:sync');

        $this->post('/register', [
            'name' => 'Nueva',
            'email' => 'nueva@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect('/');

        $this->assertTrue(User::firstWhere('email', 'nueva@example.com')->hasRole('user'));
    }
}
