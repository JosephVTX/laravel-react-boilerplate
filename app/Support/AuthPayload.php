<?php

namespace App\Support;

use App\Data\Shared\AuthData;
use App\Data\UserData;
use App\Models\User;
use Spatie\Permission\Models\Permission;

final class AuthPayload
{
    public static function for(?User $user): AuthData
    {
        if ($user === null) {
            return new AuthData(user: null, permissions: []);
        }

        $permissions = $user->hasRole(config('crud.admin_role'))
            ? Permission::query()->pluck('name')
            : $user->getAllPermissions()->pluck('name');

        return new AuthData(
            user: UserData::fromModel($user->loadMissing('roles')),
            permissions: $permissions->values()->all(),
        );
    }
}
