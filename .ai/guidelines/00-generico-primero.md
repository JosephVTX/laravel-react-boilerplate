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
