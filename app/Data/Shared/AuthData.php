<?php

namespace App\Data\Shared;

use App\Data\UserData;
use Spatie\LaravelData\Data;

class AuthData extends Data
{
    /**
     * @param  string[]  $permissions
     */
    public function __construct(
        public ?UserData $user,
        public array $permissions,
    ) {}
}
