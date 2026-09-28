@AGENTS.md

# Claude Code

- Las reglas del proyecto estan en `AGENTS.md` (secciones generadas desde `.ai/guidelines/*.md`; **edita esos archivos y ejecuta `php artisan boost:install --guidelines --no-interaction`**, no AGENTS.md a mano).
- Regla #1: **generico primero** (`.ai/guidelines/00-generico-primero.md`). Antes de escribir codigo revisa el inventario de piezas genericas.
- Los tipos del backend estan en `resources/js/types/generated.d.ts`: no abras controladores para saber que datos llegan.
- Termina toda tarea con `pnpm check` y `php artisan test`.
