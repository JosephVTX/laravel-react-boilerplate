# Backend (Laravel 13, PHP 8.3)

## Como agregar un recurso CRUD (lo normal: 5 minutos, 0 frontend)

```
php artisan make:crud Product          # modelo+migracion+factory, ProductCrud, ProductData, registro en config/crud.php
# editar migracion + $fillable, columns()/fields() de ProductCrud, propiedades de ProductData
php artisan migrate && php artisan crud:sync && pnpm types:generate
```

Resultado: `/products` con listado, busqueda, orden, paginacion, crear/editar/borrar, permisos `products.*` y entrada en el menu. Nada de React.

### `CrudDefinition` (app/Crud/CrudDefinition.php) - lo que se puede configurar

- `columns()`: `Column::make('key','Label', ColumnType::X)->sortable()->searchable()`. `sortable` alimenta `allowedSorts`; `searchable` alimenta el filtro `filter[search]` (columnas reales de BD).
- `fields()`: `Field::make('name','Label', FieldType::X)->rules([...]|fn(?Model $m) => [...])->optional()->requiredOnCreate()->virtual()->options([...])->hint()->placeholder()`.
    - `virtual()`: no es columna; lo procesas en `saved()` (ej. sincronizar roles). Checkbox: usa `->optional()` y regla `boolean`.
- `with()`: relaciones a precargar (en local `Model::shouldBeStrict` prohibe lazy loading: si falla por N+1, agrega la relacion aqui).
- `filters()`: `AllowedFilter` extra (`?filter[x]=`). `defaultSort()`, `icon()`, `deleteBlockedReason()`, `saved()`.
- Necesitas un tipo de campo/columna nuevo? Agrega el case al enum (`app/Enums`), su render en `FieldInput.tsx`/`CellValue.tsx`, y listo para TODOS los recursos.
- Necesitas un comportamiento nuevo? Agrega un hook en `CrudDefinition` (con default) en vez de un controlador nuevo.

### Permisos

- Un permiso por accion: `{slug}.view|create|update|delete`. El rol `admin` (`config('crud.admin_role')`) pasa todo via `Gate::before`.
- Tras agregar recursos: `php artisan crud:sync`. Asigna permisos a roles desde la UI (recurso `roles`) o con Spatie.
- Autoriza siempre con permisos (`$user->can('x.y')`), no con nombres de rol.

## Fuera del CRUD (logica de negocio propia)

- Controladores delgados (invocables o resource) -> `Inertia::render('carpeta/pagina', [props Data])`. Logica en clases de accion/servicio en `app/Actions` o `app/Services` reutilizables.
- Validacion: preferir clase `Data` de entrada con atributos (tipa tambien el formulario); si no, `FormRequest`.
- Listados propios: usa `Spatie\QueryBuilder\QueryBuilder` + `App\Support\Paginated::from()` (mismo contrato `Paginated<T>`); considera extender `CrudDefinition` antes.
- Rutas nuevas: en `routes/web.php`, con nombre. Ejecuta `pnpm types:generate` para que Wayfinder las exponga.
- Flash: `->with('success'|'error', 'mensaje')` (el `Toaster` global lo muestra).
- Errores 403/404/500/503 se muestran con `pages/error.tsx` automaticamente.

## Convenciones

- Estilo: `vendor/bin/pint`. Tests: `php artisan test` (PHPUnit; ver `tests/Feature/CrudTest.php` como plantilla). Todo cambio de comportamiento lleva test.
- Nada de N+1, nada de queries en bucles, `select` solo lo necesario en listados grandes, paginar siempre (`MAX_PER_PAGE = 100`).
- Configuracion via `config/*.php` + `.env`; nunca `env()` fuera de `config/`.
- Autenticacion: sesion (login/logout en `AuthController`; registro apagado por defecto con `ALLOW_REGISTRATION`). No hay reset de contrasena/verificacion de correo incluidos: agregalos como funcionalidad nueva si el proyecto los requiere.
