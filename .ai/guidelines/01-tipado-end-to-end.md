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
3. Ejecuta `npm run types:generate` (typescript:transform + wayfinder:generate).
4. En React usa el tipo generado: `props: { prop: App.Data.SomeData }`. Nunca `any`, nunca redefinir el tipo a mano.
5. `npm run check` debe pasar.

Reglas para clases `Data`:

- Constructor con propiedades promocionadas y tipos estrictos; fechas como `string` ISO (`->toIso8601String()`).
- Para modelos Eloquent define `public static function fromModel(Model $m): self` (asi `Data::from($model)` funciona y controlas los campos expuestos; nunca expongas `password`, tokens, etc.).
- No uses `Lazy`/`Optional` de Laravel Data (el transformador de tipos no los soporta); usa `?tipo`.
- Un `Data` de entrada (ej. `LoginData`) tambien sirve como request validado: atributos `#[Email]`, `#[Max]`... y se inyecta en el controlador. El mismo tipo se usa en `useForm<App.Data.Auth.LoginData>`.

## Respuestas JSON (fuera de Inertia)

`api.get(url, zodSchema)` (`lib/api.ts`). Cada schema en `lib/schemas.ts` termina con `satisfies z.ZodType<App.Data.X>`: si el tipo PHP cambia,
`npm run typecheck` falla. Prefiere Inertia (props/formularios) y usa JSON solo para widgets que cargan datos sueltos (autocompletar, polling, etc.).

## Zod

- Validacion de respuestas de `api` y validacion de formularios en cliente (`buildFormSchema`). La validacion final siempre es la de Laravel.
- No dupliques reglas de negocio en zod mas alla de lo obvio (obligatorio, formato).
