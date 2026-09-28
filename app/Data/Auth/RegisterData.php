<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class RegisterData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Email, Max(255), Unique('users', 'email')]
        public string $email,
        #[Min(8), Max(255), Confirmed]
        public string $password,
        public string $password_confirmation,
    ) {}
}
