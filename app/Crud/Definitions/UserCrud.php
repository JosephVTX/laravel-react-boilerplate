<?php

namespace App\Crud\Definitions;

use App\Crud\Column;
use App\Crud\CrudDefinition;
use App\Crud\Field;
use App\Data\UserData;
use App\Enums\ColumnType;
use App\Enums\FieldType;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

final class UserCrud extends CrudDefinition
{
    public function model(): string
    {
        return User::class;
    }

    public function data(): string
    {
        return UserData::class;
    }

    public function label(): string
    {
        return 'Usuarios';
    }

    public function singular(): string
    {
        return 'Usuario';
    }

    public function icon(): string
    {
        return 'users';
    }

    public function with(): array
    {
        return ['roles'];
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre')->sortable()->searchable(),
            Column::make('email', 'Correo')->sortable()->searchable(),
            Column::make('roles', 'Roles', ColumnType::Badges),
            Column::make('created_at', 'Creado', ColumnType::DateTime)->sortable(),
        ];
    }

    public function fields(): array
    {
        return [
            Field::make('name', 'Nombre')->rules(['string', 'max:255']),
            Field::make('email', 'Correo', FieldType::Email)->rules(fn (?Model $m) => [
                'email', 'max:255', Rule::unique('users', 'email')->ignore($m?->getKey()),
            ]),
            Field::make('password', 'Contrasena', FieldType::Password)
                ->requiredOnCreate()
                ->rules(['string', 'min:8', 'max:255'])
                ->hint('Dejar vacio para no cambiarla.'),
            Field::make('roles', 'Roles', FieldType::Multiselect)
                ->virtual()
                ->optional()
                ->options(Role::query()->orderBy('name')->pluck('name', 'name')->all())
                ->rules(['array']),
        ];
    }

    public function rules(?Model $model = null): array
    {
        return parent::rules($model) + ['roles.*' => ['string', Rule::exists('roles', 'name')]];
    }

    public function deleteBlockedReason(Model $model): ?string
    {
        return $model->is(auth()->user()) ? 'No puedes eliminar tu propio usuario.' : null;
    }

    protected function saved(Model $model, array $validated): void
    {
        /** @var User $model */
        $model->syncRoles($validated['roles'] ?? []);
    }
}
