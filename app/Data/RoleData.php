<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\Permission\Models\Role;

class RoleData extends Data
{
    /**
     * @param  string[]  $permissions
     */
    public function __construct(
        public int $id,
        public string $name,
        public array $permissions,
        public string $created_at,
    ) {}

    public static function fromModel(Role $role): self
    {
        return new self(
            id: $role->id,
            name: $role->name,
            permissions: $role->permissions->pluck('name')->sort()->values()->all(),
            created_at: $role->created_at->toIso8601String(),
        );
    }
}
