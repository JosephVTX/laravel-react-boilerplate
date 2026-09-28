<?php

namespace App\Crud\Definitions;

use App\Crud\Column;
use App\Crud\CrudDefinition;
use App\Crud\Field;
use App\Data\RoleData;
use App\Enums\ColumnType;
use App\Enums\FieldType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RoleCrud extends CrudDefinition
{
    public function model(): string
    {
        return Role::class;
    }

    public function data(): string
    {
        return RoleData::class;
    }

    public function label(): string
    {
        return 'Roles';
    }

    public function singular(): string
    {
        return 'Rol';
    }

    public function icon(): string
    {
        return 'shield';
    }

    public function with(): array
    {
        return ['permissions'];
    }

    public function defaultSort(): string
    {
        return 'name';
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre')->sortable()->searchable(),
            Column::make('permissions', 'Permisos', ColumnType::Badges),
            Column::make('created_at', 'Creado', ColumnType::DateTime)->sortable(),
        ];
    }

    public function fields(): array
    {
        return [
            Field::make('name', 'Nombre')->rules(fn (?Model $m) => [
                'string', 'max:125', Rule::unique('roles', 'name')->ignore($m?->getKey()),
            ]),
            Field::make('permissions', 'Permisos', FieldType::Multiselect)
                ->virtual()
                ->optional()
                ->options(Permission::query()->orderBy('name')->pluck('name', 'name')->all())
                ->rules(['array']),
        ];
    }

    public function rules(?Model $model = null): array
    {
        return parent::rules($model) + ['permissions.*' => ['string', Rule::exists('permissions', 'name')]];
    }

    public function deleteBlockedReason(Model $model): ?string
    {
        return $model->name === config('crud.admin_role') ? 'El rol administrador no se puede eliminar.' : null;
    }

    protected function attributes(array $validated, ?Model $model): array
    {
        return parent::attributes($validated, $model) + ['guard_name' => $model?->guard_name ?? config('auth.defaults.guard')];
    }

    protected function saved(Model $model, array $validated): void
    {
        /** @var Role $model */
        $model->syncPermissions($validated['permissions'] ?? []);
    }
}
