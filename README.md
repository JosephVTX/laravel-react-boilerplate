# Laravel Boilerplate (Inertia + React + TypeScript)

Base **generica** para cualquier proyecto: un recurso nuevo = una clase PHP, cero frontend. Pensada para que una IA (o una persona) se centre en
funcionalidad nueva y no en recrear CRUDs, tablas, formularios ni tipos.

**Stack:** Laravel 13 · Inertia 3 · React 19 · TypeScript estricto · Axios + Zod · Tailwind CSS 4 · DaisyUI 5 · oxlint/oxfmt (sin ESLint) ·
Laravel Wayfinder · spatie/laravel-permission · spatie/laravel-query-builder · spatie/laravel-data (+ typescript-transformer) · Laravel Boost (MCP).

## Inicio rapido (Laragon: Apache + MySQL + Redis)

```bash
composer setup                 # instala, .env, key, migra, permisos, npm, tipos y build
# crear la BD `laravel_boilerplate` en MySQL antes (usuario root sin clave por defecto en Laragon)
php artisan db:seed            # admin@example.com / password  (+ 20 usuarios de prueba)
composer dev                   # servidor + vite (HMR)   |   o usa el vhost de Laragon + `npm run dev`
```

Comandos utiles: `npm run types:generate` · `npm run check` (tsc + oxlint) · `php artisan test` · `composer check` (Pint + PHPUnit + tsc + oxlint) · `npm run test:e2e` (Playwright, BD `laravel_boilerplate_e2e` aislada; primero `npx playwright install chromium`).

## La idea: tipado end-to-end (estilo tRPC)

```
app/Data/*.php  --(php artisan typescript:transform)-->  resources/js/types/generated.d.ts   =>  App.Data.UserData ...
routes + controllers  --(Wayfinder)-->                  resources/js/routes, resources/js/actions
```

El frontend conoce la forma de **todos** los datos, props compartidas, enums y rutas sin leer el backend. Los tipos generados se commitean.

## Un recurso CRUD nuevo

```bash
php artisan make:crud Product
# completar migracion, $fillable, columns()/fields() en app/Crud/Definitions/ProductCrud.php y app/Data/ProductData.php
php artisan migrate && php artisan crud:sync && npm run types:generate
```

`/products` ya tiene: listado paginado, busqueda, orden, crear/editar/eliminar en modal, validacion (cliente y servidor), permisos Spatie
(`products.view|create|update|delete`), toasts y entrada de menu. Todo lo hacen `CrudDefinition`, `CrudController` y `pages/crud/index.tsx`.

## Estructura

| Ruta                                       | Contenido                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/Crud/`                                | `CrudDefinition` (base), `Column`, `Field`, `CrudRegistry`, `Definitions/` (Users, Roles)                                                   |
| `app/Data/`                                | DTOs -> tipos TypeScript                                                                                                                    |
| `app/Http/Controllers/CrudController.php`  | Controlador unico de todos los CRUD                                                                                                         |
| `config/crud.php`                          | Registro `slug => Definition` (URL, permisos y menu)                                                                                        |
| `resources/js/pages/crud/index.tsx`        | Pagina unica de todos los CRUD                                                                                                              |
| `resources/js/components/{ui,crud,layout}` | Piezas reutilizables (DaisyUI)                                                                                                              |
| `.ai/guidelines/`                          | **Reglas de IA del proyecto** (fuente; se compilan a `AGENTS.md`/`CLAUDE.md` con `php artisan boost:install --guidelines --no-interaction`) |

## Para la IA

- Reglas: `AGENTS.md` / `CLAUDE.md` (generico primero, tipado, backend, frontend, bajos recursos) + Laravel Boost MCP (`.mcp.json`, `php artisan boost:mcp`)
  para docs versionadas, esquema de BD, rutas, logs y tinker.
- Cambiar reglas: editar `.ai/guidelines/*.md` y ejecutar `php artisan boost:install --guidelines --no-interaction`.

## Produccion / servidores pequenos

Ver [`docs/DEPLOY.md`](docs/DEPLOY.md), `.env.production.example` y `deploy.sh`.

## Decisiones

- **Sin SSR**, sin Node en produccion; paginas React en lazy; Redis para sesion/cache/colas.
- **Sin ESLint**: `oxlint` (`.oxlintrc.json`) y `oxfmt` para formato.
- Auth de sesion incluida (login/logout; registro opcional con `ALLOW_REGISTRATION=true`). Reset de contrasena y verificacion de correo **no** incluidos.
- El tipo `Paginated<T>` y `CrudIndexProps<T>` son contratos manuales (`resources/js/types/index.ts`); el resto se genera.
