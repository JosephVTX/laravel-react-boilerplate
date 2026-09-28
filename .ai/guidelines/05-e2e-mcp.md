# E2E con el MCP de Chrome DevTools (no hay Playwright)

Las pruebas de navegador las ejecuta la IA **conduciendo el navegador real del usuario (Brave/Edge) mediante el MCP `chrome-devtools`** (`.mcp.json`).
Los escenarios estan en `e2e/SCENARIOS.md`: es la fuente de verdad de los flujos de UI.

## Como correrlos

1. `pnpm e2e:server` -> compila, recrea la BD aislada `laravel_boilerplate_e2e` y sirve en `http://127.0.0.1:8123`.
2. `pnpm e2e:browser` -> abre Brave (o `BROWSER=edge`) con `--remote-debugging-port=9333` y un perfil aislado.
3. Ejecuta los escenarios de `e2e/SCENARIOS.md` con las herramientas del MCP (`take_snapshot`, `click`, `fill`, `wait_for`, `list_console_messages`, `list_network_requests`...) y reporta `escenario | OK/FALLO | detalle`.

## Reglas

- Un flujo de UI nuevo o modificado **agrega/actualiza su escenario en `e2e/SCENARIOS.md`** en el mismo cambio.
- **Todas las herramientas del MCP exigen `pageId`** (obtenlo con `list_pages`). Los `uid` de `take_snapshot` caducan al navegar: toma un snapshot nuevo antes de cada interaccion.
- Un escenario solo es OK si no hay errores de consola ni respuestas 5xx.
- Usa `take_snapshot` (texto/a11y) antes de cada interaccion; usa capturas solo para diagnosticar fallos.
- Nunca apuntes el MCP a un perfil con sesiones reales del usuario: usa el perfil aislado que crea `pnpm e2e:browser`.
- Los tests de backend (PHPUnit, `php artisan test`) siguen siendo obligatorios y automaticos; el E2E por MCP es la verificacion de UI.
