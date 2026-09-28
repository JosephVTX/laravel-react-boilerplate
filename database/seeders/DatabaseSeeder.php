<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Artisan::call('crud:sync');

        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
        ])->assignRole(config('crud.admin_role'));

        User::factory(20)->create()->each->assignRole('user');
    }
}
