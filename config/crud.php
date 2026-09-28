<?php

use App\Crud\Definitions\RoleCrud;
use App\Crud\Definitions\UserCrud;

/*
 | Recursos CRUD genericos: 'slug' => Definicion.
 | El slug es la URL (/users), el prefijo de permisos (users.view ...) y el nombre de ruta (users.index).
 | Despues de agregar uno: `php artisan crud:sync` (permisos) y `php artisan wayfinder:generate` (opcional).
 */
return [
    'resources' => [
        'users' => UserCrud::class,
        'roles' => RoleCrud::class,
    ],

    /* Rol con acceso total (Gate::before) */
    'admin_role' => 'admin',
];
