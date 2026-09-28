<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CrudController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MeController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:'.config('app.auth_throttle_per_minute').',1')->name('login.store');

    // Siempre registradas (rutas tipadas estables en Wayfinder); el controlador responde 404 si ALLOW_REGISTRATION=false.
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:'.config('app.auth_throttle_per_minute').',1')->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('api/me', MeController::class)->name('api.me');

    // Un CRUD completo por cada entrada de config/crud.php (todos usan el mismo CrudController).
    foreach (array_keys(config('crud.resources')) as $slug) {
        Route::prefix($slug)->name("{$slug}.")->group(function () use ($slug) {
            Route::get('/', [CrudController::class, 'index'])->name('index')->defaults('resource', $slug);
            Route::post('/', [CrudController::class, 'store'])->name('store')->defaults('resource', $slug);
            Route::put('{id}', [CrudController::class, 'update'])->name('update')->defaults('resource', $slug);
            Route::delete('{id}', [CrudController::class, 'destroy'])->name('destroy')->defaults('resource', $slug);
        });
    }
});
