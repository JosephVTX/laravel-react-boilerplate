<?php

namespace App\Console\Commands;

use App\Crud\CrudRegistry;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

#[Signature('crud:sync')]
#[Description('Crea los permisos de todos los recursos de config/crud.php y los asigna al rol administrador')]
class CrudSync extends Command
{
    public function handle(CrudRegistry $registry): int
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = config('auth.defaults.guard');
        $names = collect($registry->all())->flatMap(fn ($d) => $d->permissions());

        $names->each(fn (string $name) => Permission::findOrCreate($name, $guard));

        Role::findOrCreate(config('crud.admin_role'), $guard)->syncPermissions(Permission::all());
        Role::findOrCreate('user', $guard);

        $this->info("{$names->count()} permisos sincronizados.");

        return self::SUCCESS;
    }
}
