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
