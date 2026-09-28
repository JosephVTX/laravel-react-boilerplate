<?php

namespace App\Data\Shared;

use Spatie\LaravelData\Data;

class NavItemData extends Data
{
    public function __construct(
        public string $label,
        public string $href,
        /** Nombre de icono lucide-react (ver resources/js/components/ui/Icon.tsx). */
        public string $icon,
    ) {}
}
