<?php

namespace App\Crud;

use App\Data\Crud\CrudMetaData;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\LaravelData\Data;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * Describe UN recurso CRUD completo (modelo, salida tipada, columnas, campos, permisos).
 * El CrudController y la pagina React `crud/index` son genericos: solo consumen esta clase.
 * Para agregar un recurso: crear una subclase, registrarla en config/crud.php y correr `php artisan crud:sync`.
 *
 * Permisos generados (Spatie): "{slug}.view", "{slug}.create", "{slug}.update", "{slug}.delete".
 */
abstract class CrudDefinition
{
    public const ABILITIES = ['view', 'create', 'update', 'delete'];

    public const MAX_PER_PAGE = 100;

    public function __construct(public readonly string $slug) {}

    /** @return class-string<Model> */
    abstract public function model(): string;

    /** @return class-string<Data> Data de salida. Debe tener `fromModel(Model)`. */
    abstract public function data(): string;

    /** Nombre en plural (menu y titulo). */
    abstract public function label(): string;

    /** Nombre en singular (botones y modales). */
    abstract public function singular(): string;

    /** @return list<Column> */
    abstract public function columns(): array;

    /** @return list<Field> */
    abstract public function fields(): array;

    /** Nombre de icono lucide-react registrado en resources/js/components/ui/Icon.tsx. */
    public function icon(): string
    {
        return 'folder';
    }

    /** Relaciones a precargar (evita N+1; el lazy loading esta prohibido en local). */
    public function with(): array
    {
        return [];
    }

    /** Orden por defecto de spatie/query-builder (prefijo `-` = descendente). */
    public function defaultSort(): string
    {
        return '-id';
    }

    /** @return list<AllowedFilter> Filtros extra (`?filter[x]=`) ademas de `search`. */
    public function filters(): array
    {
        return [];
    }

    public function permission(string $ability): string
    {
        return "{$this->slug}.{$ability}";
    }

    /** @return list<string> */
    public function permissions(): array
    {
        return array_map(fn (string $a) => $this->permission($a), self::ABILITIES);
    }

    /** Motivo por el que NO se puede borrar el registro (null = se puede). */
    public function deleteBlockedReason(Model $model): ?string
    {
        return null;
    }

    /** Hook post-guardado (dentro de la transaccion): sincronizar relaciones/campos virtuales. */
    protected function saved(Model $model, array $validated): void {}

    /** @return array<string, array<int, mixed>> */
    public function rules(?Model $model = null): array
    {
        return collect($this->fields())
            ->mapWithKeys(fn (Field $f) => [$f->name => $f->validationRules($model)])
            ->all();
    }

    public function meta(Request $request): CrudMetaData
    {
        $user = $request->user();

        return new CrudMetaData(
            slug: $this->slug,
            label: $this->label(),
            singular: $this->singular(),
            baseUrl: '/'.$this->slug,
            columns: array_map(fn (Column $c) => $c->toData(), $this->columns()),
            fields: array_map(fn (Field $f) => $f->toData(), $this->fields()),
            searchable: $this->searchableColumns() !== [],
            canCreate: (bool) $user?->can($this->permission('create')),
            canUpdate: (bool) $user?->can($this->permission('update')),
            canDelete: (bool) $user?->can($this->permission('delete')),
            defaultSort: $this->defaultSort(),
        );
    }

    /** Listado paginado con filtros/orden/busqueda (spatie/query-builder). */
    public function paginate(Request $request): LengthAwarePaginator
    {
        $model = $this->model();
        $sortable = collect($this->columns())->filter->isSortable()->map->key->all();
        $perPage = min(max((int) $request->integer('per_page', 15), 1), self::MAX_PER_PAGE);

        return QueryBuilder::for($this->newQuery(), $request)
            ->allowedFilters($this->searchFilter(), ...$this->filters())
            ->allowedSorts(...$sortable)
            ->defaultSort($this->defaultSort())
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Model $m) => $this->toData($m));
    }

    public function toData(Model $model): Data
    {
        return ($this->data())::from($model->loadMissing($this->with()));
    }

    public function find(string|int $id): Model
    {
        return $this->newQuery()->findOrFail($id);
    }

    public function create(array $validated): Model
    {
        return DB::transaction(function () use ($validated) {
            $model = new ($this->model());
            $model->fill($this->attributes($validated, null))->save();
            $this->saved($model, $validated);

            return $model;
        });
    }

    public function update(Model $model, array $validated): Model
    {
        return DB::transaction(function () use ($model, $validated) {
            $model->fill($this->attributes($validated, $model))->save();
            $this->saved($model, $validated);

            return $model;
        });
    }

    public function delete(Model $model): void
    {
        $model->delete();
    }

    /** Atributos a persistir (fill respeta $fillable): excluye campos virtuales y "requiredOnCreate" vacios al editar. */
    protected function attributes(array $validated, ?Model $model): array
    {
        $attributes = [];

        foreach ($this->fields() as $field) {
            if ($field->isVirtual() || ! array_key_exists($field->name, $validated)) {
                continue;
            }

            if ($model !== null && $field->isRequiredOnCreateOnly() && blank($validated[$field->name])) {
                continue;
            }

            $attributes[$field->name] = $validated[$field->name];
        }

        return $attributes;
    }

    /** @return list<string> */
    protected function searchableColumns(): array
    {
        return collect($this->columns())->filter->isSearchable()->map->key->values()->all();
    }

    protected function newQuery(): Builder
    {
        return $this->model()::query()->with($this->with());
    }

    private function searchFilter(): AllowedFilter
    {
        $columns = $this->searchableColumns();

        return AllowedFilter::callback('search', function (Builder $query, mixed $value) use ($columns) {
            $term = '%'.addcslashes(is_array($value) ? implode(' ', $value) : (string) $value, '%_\\').'%';

            $query->where(function (Builder $q) use ($columns, $term) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', $term);
                }
            });
        });
    }
}
