<?php

namespace App\Http\Controllers;

use App\Data\Shared\AuthData;
use App\Support\AuthPayload;
use Illuminate\Http\Request;

/** Ejemplo de endpoint JSON tipado (consumido con axios + zod en resources/js/lib/api.ts). */
class MeController extends Controller
{
    public function __invoke(Request $request): AuthData
    {
        return AuthPayload::for($request->user());
    }
}
