<laravel-boost-guidelines>
=== .ai/00-generico-primero rules ===

# REGLA FUNDAMENTAL: GENERICO PRIMERO (leer antes de escribir cualquier codigo)

Este proyecto es un boilerplate cuya razon de ser es que **la IA NO recree codigo repetitivo**. Cada vez que
vayas a escribir algo, aplica este orden de decision **sin excepciones**:

1. **¿Ya existe una pieza generica que lo resuelve?** -> usala/configurala. NO escribas codigo nuevo.
2. **¿Casi lo resuelve?** -> EXTIENDE la pieza generica (nuevo hook en `CrudDefinition`, nuevo `FieldType`/`ColumnType`,
   nueva prop opcional en un componente). Nunca copies y pegues una variante.
3. **¿Es realmente nuevo?** -> escribelo, pero **hazlo generico desde el inicio** (parametrizado por definicion/props,
   no por el caso concreto) si existe la mas minima posibilidad de que se repita en otro recurso/pantalla.
4. Si ves dos cosas parecidas en el repo, **refactoriza a una** en vez de agregar una tercera.

## Inventario de piezas genericas (usalas ANTES de crear algo)

| Necesidad                                                                             | Pieza generica                                                                            | Donde                                                                                      |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| CRUD completo (listado, busqueda, orden, paginacion, crear, editar, borrar, permisos) | `CrudDefinition` + `CrudController` + pagina `crud/index`                                 | `app/Crud`, `app/Http/Controllers/CrudController.php`, `resources/js/pages/crud/index.tsx` |
| Crear un recurso CRUD nuevo                                                           | `php artisan make:crud Nombre`                                                            | `app/Console/Commands/MakeCrud.php`                                                        |
| Filtros/orden/busqueda/includes de listados                                           | spatie/query-builder dentro de `CrudDefinition::paginate()`                               | `app/Crud/CrudDefinition.php`                                                              |
| Permisos y roles                                                                      | spatie/laravel-permission: `{slug}.{view,create,update,delete}` + `php artisan crud:sync` | `app/Console/Commands/CrudSync.php`                                                        |
| Contratos backend->frontend                                                           | clases `Data` (spatie/laravel-data) -> TypeScript automatico                              | `app/Data`, `resources/js/types/generated.d.ts`                                            |
| Paginacion                                                                            | `App\Support\Paginated` <-> `Paginated<T>`                                                | `app/Support/Paginated.php`, `resources/js/types/index.ts`                                 |
| Rutas tipadas en el frontend                                                          | Laravel Wayfinder                                                                         | `resources/js/routes`, `resources/js/actions`                                              |
| Formularios                                                                           | `FieldInput` + `useForm` de Inertia + `buildFormSchema` (zod)                             | `resources/js/components/crud`, `resources/js/lib/form-schema.ts`                          |
| Tabla                                                                                 | `DataTable` + `CellValue`                                                                 | `resources/js/components/crud`                                                             |
| Estado de listado en URL                                                              | `useCrudQuery`                                                                            | `resources/js/hooks/useCrudQuery.ts`                                                       |
| Modales / confirmar / toasts / paginador / iconos                                     | `Modal`, `ConfirmDialog`, `Toaster`, `Pagination`, `Icon`                                 | `resources/js/components/ui`                                                               |
| Permisos en la UI                                                                     | `usePermissions().can('users.create')`                                                    | `resources/js/hooks/usePermissions.ts`                                                     |
| Llamadas JSON (no Inertia)                                                            | `api.get/post/put/delete(url, zodSchema)`                                                 | `resources/js/lib/api.ts`                                                                  |
| Menu lateral                                                                          | se genera solo desde `config/crud.php` (permiso `.view`)                                  | `CrudRegistry::navigationFor()`                                                            |
| Layouts                                                                               | `AppLayout` / `GuestLayout` se asignan solos por nombre de pagina                         | `resources/js/app.tsx`                                                                     |

## Prohibido (senales de que estas duplicando)

- Crear un controlador, form request, pagina React, tabla o formulario "por recurso" para un CRUD normal.
- Copiar `crud/index.tsx` a `pages/productos/index.tsx`. Si el CRUD necesita algo especial, agrega un hook/prop generico.
- Escribir a mano tipos TypeScript de datos que vienen del backend (ver `01-tipado-end-to-end.md`).
- Escribir URLs a mano (`'/users/1'`) en paginas propias: usa Wayfinder. (El CRUD generico usa `meta.baseUrl` porque no puede importar
  rutas de un recurso concreto.)
- Crear otro componente de modal/boton/input/badge si DaisyUI o `components/ui` ya lo cubren.
- Agregar librerias para algo que ya resuelve una pieza existente.

## Cuando SI escribes codigo nuevo

Funcionalidad de negocio que no es CRUD: dashboards, reportes, flujos multi-paso, integraciones, jobs. Aun asi: reutiliza `Data`, `Paginated`,
`api`, `Modal`, `FieldInput`, `useCrudQuery`, y si detectas un patron repetible, extraelo a una pieza generica y **documentalo en este inventario**.

## Mantenimiento de estas reglas

Si creas una nueva pieza generica, agregala a la tabla de arriba en el mismo cambio. Este archivo es la fuente de verdad del proyecto.

=== .ai/01-tipado-end-to-end rules ===

# Tipado end-to-end (estilo tRPC): el frontend NUNCA adivina el backend

Objetivo: no leer el backend para saber que datos llegan. **Los tipos ya estan en el frontend.**

## Fuente de verdad

| Que                                | Origen (PHP)                                                    | Tipo en el frontend                                                  | Generacion                                                          |
| ---------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Datos que salen del backend / DTOs | clases que extienden `Spatie\LaravelData\Data` en `app/Data/**` | `App.Data.*` (namespace global)                                      | `php artisan typescript:transform`                                  |
| Enums                              | `app/Enums/*`                                                   | `App.Enums.*` (union de strings)                                     | igual                                                               |
| Props compartidas de Inertia       | `App\Data\Shared\SharedData` (`HandleInertiaRequests::share`)   | `usePage().props` ya tipado (`types/inertia.d.ts`)                   | igual                                                               |
| Rutas y acciones                   | `routes/web.php` + controladores                                | `@/routes/*`, `@/actions/*`                                          | `php artisan wayfinder:generate` (el plugin de Vite lo hace en dev) |
| Paginacion / props de CRUD         | `Paginated`, `CrudController`                                   | `Paginated<T>`, `CrudIndexProps<T>` en `resources/js/types/index.ts` | manual (contrato generico estable)                                  |

Archivo generado: `resources/js/types/generated.d.ts`. **No editar a mano. Se commitea** para que cualquier agente lo lea sin ejecutar nada.
Consultalo (o `resources/js/types/index.ts`) para saber la forma de los datos: **no abras controladores para averiguarlo**.

## Flujo obligatorio al cambiar datos del backend

1. Crea/edita la clase `Data` en `app/Data` (propiedades tipadas; arrays con docblock `@param string[] $x` o `@param Foo[] $x`).
2. Devuelvela desde el controlador (`Inertia::render('pagina', ['prop' => SomeData::from(...)])`).
3. Ejecuta `pnpm types:generate` (typescript:transform + wayfinder:generate).
4. En React usa el tipo generado: `props: { prop: App.Data.SomeData }`. Nunca `any`, nunca redefinir el tipo a mano.
5. `pnpm check` debe pasar.

Reglas para clases `Data`:

- Constructor con propiedades promocionadas y tipos estrictos; fechas como `string` ISO (`->toIso8601String()`).
- Para modelos Eloquent define `public static function fromModel(Model $m): self` (asi `Data::from($model)` funciona y controlas los campos expuestos; nunca expongas `password`, tokens, etc.).
- No uses `Lazy`/`Optional` de Laravel Data (el transformador de tipos no los soporta); usa `?tipo`.
- Un `Data` de entrada (ej. `LoginData`) tambien sirve como request validado: atributos `#[Email]`, `#[Max]`... y se inyecta en el controlador. El mismo tipo se usa en `useForm<App.Data.Auth.LoginData>`.

## Respuestas JSON (fuera de Inertia)

`api.get(url, zodSchema)` (`lib/api.ts`). Cada schema en `lib/schemas.ts` termina con `satisfies z.ZodType<App.Data.X>`: si el tipo PHP cambia,
`pnpm typecheck` falla. Prefiere Inertia (props/formularios) y usa JSON solo para widgets que cargan datos sueltos (autocompletar, polling, etc.).

## Zod

- Validacion de respuestas de `api` y validacion de formularios en cliente (`buildFormSchema`). La validacion final siempre es la de Laravel.
- No dupliques reglas de negocio en zod mas alla de lo obvio (obligatorio, formato).

=== .ai/02-backend rules ===

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

=== .ai/03-frontend rules ===

# Frontend (React 19 + TypeScript estricto + Inertia + Tailwind 4 + DaisyUI 5)

## Estructura (`resources/js`)

```
app.tsx                 # createInertiaApp; paginas lazy; layout por defecto segun nombre de pagina
pages/                  # 1 archivo por pagina Inertia (nombre = Inertia::render('carpeta/pagina'))
  crud/index.tsx        # UNICA pagina para todos los CRUD
  auth/*, dashboard.tsx, error.tsx
components/ui/          # Modal, ConfirmDialog, Pagination, Toaster, Icon
components/crud/        # DataTable, CellValue, FieldInput, CrudFormModal, RowActions, simple-field
components/layout/      # AppLayout (sidebar generado del backend), GuestLayout
hooks/                  # useCrudQuery, usePermissions
lib/                    # api (axios+zod), schemas, form-schema, format
types/                  # generated.d.ts (NO editar), index.ts (contratos genericos), inertia.d.ts
routes/ actions/ wayfinder/   # generados por Wayfinder (NO editar)
```

Alias `@/` = `resources/js/`. Imports con `@/...`.

## Reglas

- **TypeScript estricto, cero `any`** (oxlint lo prohibe). Props de pagina tipadas con los tipos generados (`App.Data.*`) o `CrudIndexProps<T>`. Nunca redeclares un tipo que ya existe en `generated.d.ts`.
- Estilos: clases de **DaisyUI 5** (`btn`, `card`, `input`, `modal`, `menu`, `badge`, `alert`, `table`, `join`, `toast`...) + utilidades Tailwind 4. No CSS propio salvo excepcion; no otras librerias de UI. Temas `light`/`dark` (toggle en `AppLayout`).
- **Paginas nuevas** (no CRUD): `pages/<carpeta>/<pagina>.tsx`, `export default function`. Usa `<Head title=... />`. El layout se aplica solo; para uno distinto define `Pagina.layout = ...`.
- **Navegacion / URLs**: `Link` de Inertia + funciones de Wayfinder (`import { dashboard } from '@/routes'`, `dashboard.url()`), o `@/actions/...`. Nunca strings de URL a mano en paginas propias.
- **Formularios**: `useForm<TipoDelDataPHP>()` de Inertia; errores en `form.errors`; campos con `FieldInput` (+ `simpleField()` para formularios fuera del CRUD). Validacion previa opcional con zod.
- **Datos por JSON**: solo con `api` (`lib/api.ts`) + schema zod en `lib/schemas.ts` (con `satisfies z.ZodType<...>`).
- **Permisos en UI**: `usePermissions().can('recurso.accion')`. Ocultar botones es solo UX; la seguridad real esta en el backend.
- **Iconos**: agregarlos al registro `components/ui/Icon.tsx` (solo lo registrado entra al bundle). Referenciados por nombre desde PHP (`icon()`).
- Accesibilidad: labels/aria en controles solo-icono, `dialog` nativo para modales (ya en `Modal`).
- Rendimiento: paginas en lazy (automatico), sin librerias pesadas (evita moment, lodash completo, chart libs salvo necesidad real y cargadas con `import()` dinamico).

## Comandos

`pnpm dev` | `pnpm build` | `pnpm typecheck` (tsc) | `pnpm lint` (**oxlint**, no eslint) | `pnpm format` (oxfmt) | `pnpm types:generate` | `pnpm check`.
Antes de terminar una tarea: `pnpm check` y `php artisan test` deben pasar (y `pnpm test:e2e` si tocaste flujos de UI).

=== .ai/04-bajos-recursos rules ===

# Optimizado para servidores de bajos recursos

Todo cambio debe respetar que esto corre en VPS de 512 MB - 1 GB de RAM y 1 vCPU.

- **Sin SSR** ni procesos Node en produccion: solo se sirve `public/build` (estatico, gzip/brotli en el servidor web). Node se usa unicamente para compilar.
- **Redis** para sesion/cache/colas (`SESSION_DRIVER=redis`, `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`); `REDIS_CLIENT=phpredis` en produccion. Alternativa sin Redis: `database` o `file` (ver `docs/DEPLOY.md`).
- **Colas**: un solo worker con limites (`queue:work --max-jobs=500 --max-time=3600 --memory=128`). Jobs pequenos; nada de cargar colecciones enormes en memoria (`chunk`, `cursor`, `lazy`).
- **Consultas**: paginar siempre, indexar columnas usadas en `where`/`orderBy`/`search`, precargar relaciones (`with()`), evitar `count()` innecesarios. En local `Model::shouldBeStrict()` detecta N+1 y atributos inexistentes.
- **Cache**: `php artisan optimize` en cada deploy (config, rutas, vistas, eventos). Cachea con `Cache::remember` lo caro y estable (permisos ya se cachean por Spatie).
- **Frontend**: paginas lazy, iconos registrados (tree-shaking), sin dependencias pesadas, imagenes optimizadas. Vigila el tamano de `pnpm build`.
- **Logs**: `LOG_LEVEL=warning` en produccion; `LOG_STACK=daily` con rotacion corta si el disco es chico.
- **Dependencias**: antes de agregar un paquete (composer/pnpm) verifica que no exista ya una pieza generica en el proyecto y evalua su costo en RAM/bundle.
- Despliegue: `docs/DEPLOY.md` y `deploy.sh`.

=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application running on PHP 8.3. You are an expert with the Laravel ecosystem. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:

- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `pnpm run build`, `pnpm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists (settled decisions, non-obvious traps, standing constraints). Framework and package guidelines that only apply to specific paths (testing, frontend, components) also live there, under `.ai/rules/boost` — this is not just recorded decisions, it is load-bearing guidance you have not seen inline. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.
- Record a rule with `record-rule` only when the user explicitly asks for one. Instructions for the work at hand are not rules, no matter how emphatic: "remove this typo", "use X here" are work to do, not rules to record. Never record a rule on your own initiative, as a byproduct of a change, or to summarize what you just did. When the user does ask, pass a `glob` (e.g. `app/Http/Controllers/**`), a short `title`, and a few-line `note`. Use `record-rule` rather than your native memory or notes tool, because native memory is personal and session-scoped, while only `.ai/rules` is shared with the team and persists in the repo.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
    - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.
- Activate the `deploying-to-cloud` skill whenever deploying to Laravel Cloud, configuring Cloud environments or resources, using the Cloud CLI, or troubleshooting Cloud deployments.

=== tests rules ===

# Test Enforcement

- Add or update tests for behavior and logic changes when a test provides meaningful regression coverage.
- Pure copy, styling, and layout-only changes do not require new or updated tests.
- When test coverage applies, run the affected tests and ensure they pass.
- Test the changed behavior and its important failure modes, but do not add tests beyond them.
- Read the `testing-best-practices` skill before writing tests.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `pnpm run build` or ask the user to run `pnpm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== phpunit/core rules ===

# PHPUnit

- This project uses PHPUnit. Create tests with `php artisan make:test --phpunit {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `php artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/phpunit` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
