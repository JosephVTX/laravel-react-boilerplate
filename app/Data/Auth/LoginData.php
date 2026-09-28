<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/** Payload tipado del login: se valida en backend y se reutiliza como tipo del useForm en el frontend. */
class LoginData extends Data
{
    public function __construct(
        #[Email, Max(255)]
        public string $email,
        #[Max(255)]
        public string $password,
        public bool $remember = false,
    ) {}
}
