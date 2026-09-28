<?php

namespace App\Http\Middleware;

use App\Crud\CrudRegistry;
use App\Data\Shared\FlashData;
use App\Data\Shared\SharedData;
use App\Support\AuthPayload;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Props compartidas (tipo TS: App.Data.Shared.SharedData). Cualquier cambio aqui se refleja
     * en el frontend tras `php artisan typescript:transform`.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            ...SharedData::from([
                'appName' => config('app.name'),
                'auth' => AuthPayload::for($user),
                'flash' => new FlashData(
                    success: $request->session()->get('success'),
                    error: $request->session()->get('error'),
                ),
                'navigation' => app(CrudRegistry::class)->navigationFor($user),
            ])->toArray(),
        ];
    }
}
