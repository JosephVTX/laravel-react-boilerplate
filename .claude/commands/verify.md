---
description: Verificacion completa del cambio actual (tests PHP, tipos, lint y E2E por MCP si hay UI)
---

Verifica el trabajo actual de forma inteligente, sin pedirme nada:

1. `git status` y `git diff` para entender que cambio.
2. Aplica la matriz de `.ai/guidelines/06-testing.md`: por cada cambio, comprueba que existe el test que le corresponde.
   Si falta, **escribelo** (usa el trait `Tests\Concerns\CrudResourceTests` para recursos CRUD; no dupliques lo que ya cubre).
3. Ejecuta `vendor/bin/pint --dirty`, `pnpm types:generate` si tocaste `app/Data`, rutas o enums, `pnpm check` y `php artisan test`. Arregla lo que falle (causa raiz, no desactives tests).
4. Si tocaste UI o flujos: actualiza `e2e/SCENARIOS.md` y ejecuta los escenarios afectados con el MCP `chrome-devtools`
   (`pnpm e2e:server` en segundo plano, `pnpm e2e:browser`, luego las herramientas del MCP). Reporta la tabla `escenario | OK/FALLO`.
5. Termina con un resumen corto: que tests agregaste, que ejecutaste y el resultado real (sin maquillar fallos).
