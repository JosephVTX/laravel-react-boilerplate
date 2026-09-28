<?php

namespace App\Providers;

use App\Crud\CrudRegistry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CrudRegistry::class, fn () => new CrudRegistry(config('crud.resources')));
    }

    public function boot(): void
    {
        // Rol administrador: acceso total sin asignar permisos uno a uno.
        Gate::before(fn ($user) => $user->hasRole(config('crud.admin_role')) ? true : null);

        // Errores tempranos en desarrollo (N+1, atributos inexistentes); silencioso en produccion.
        Model::shouldBeStrict(! $this->app->isProduction());
        DB::prohibitDestructiveCommands($this->app->isProduction());

        // Recursos precargados para servidores lentos.
        Vite::prefetch(concurrency: 3);
    }
}
