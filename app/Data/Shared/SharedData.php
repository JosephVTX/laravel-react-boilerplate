<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Data;

/** Props compartidas por Inertia en TODAS las paginas (ver HandleInertiaRequests). */
class SharedData extends Data
{
    /**
     * @param  NavItemData[]  $navigation
     */
    public function __construct(
        public string $appName,
        public AuthData $auth,
        public FlashData $flash,
        public array $navigation,
    ) {}
}
