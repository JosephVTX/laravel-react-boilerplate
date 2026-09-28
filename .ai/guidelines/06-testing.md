# Tests: los escribes TU (Claude) como parte de cada cambio

Ninguna tarea esta terminada sin tests que la cubran. No esperes a que el usuario los pida. Un hook `Stop`
(`scripts/claude-verify.mjs`, configurado en `.claude/settings.json`) **bloquea el cierre** si cambiaste codigo sin tests o si
`pnpm check` / `php artisan test` fallan. Usa `/verify` para la verificacion completa y `/new-crud` para recursos nuevos.

## Matriz: que cambio -> que test

| Cambio                                                                | Test obligatorio                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recurso CRUD nuevo (`make:crud`)                                      | Se genera `tests/Feature/Crud/{Nombre}CrudTest.php` con el trait `Tests\Concerns\CrudResourceTests` (auth, 403, listado, crear, validar, editar, borrar). Ajusta `validPayload()`/`invalidPayload()`. Reglas de negocio propias (unicos, relaciones, `deleteBlockedReason`, `saved`) -> tests extra en la misma clase |
| Hook/comportamiento nuevo en `CrudDefinition`, `Field`, `Column`      | Unit en `tests/Unit` + un caso en un `*CrudTest` que lo use                                                                                                                                                                                                                                                           |
| Controlador/ruta propia                                               | Feature test: guest redirigido, permiso 403, caso feliz (`assertInertia`: componente + props), validacion (`assertSessionHasErrors`)                                                                                                                                                                                  |
| Clase `Data` nueva o cambiada                                         | Feature que verifique la forma de las props; `pnpm types:generate` y `pnpm typecheck`                                                                                                                                                                                                                                 |
| Servicio/accion/job de negocio                                        | Unit (sin BD si es posible) o Feature; simula servicios externos (`Http::fake`, `Queue::fake`, `Mail::fake`)                                                                                                                                                                                                          |
| Politica/permiso                                                      | Feature con usuario con y sin el permiso                                                                                                                                                                                                                                                                              |
| Bug corregido                                                         | Primero un test que reproduce el bug (falla), luego el arreglo                                                                                                                                                                                                                                                        |
| Pagina/componente/flujo de UI nuevo o cambiado                        | Escenario en `e2e/SCENARIOS.md` + ejecutarlo con el MCP `chrome-devtools` (ver `05-e2e-mcp.md`)                                                                                                                                                                                                                       |
| Componente React generico nuevo (`components/ui` o `components/crud`) | Escenario E2E que lo ejercite; tipos estrictos sin `any`                                                                                                                                                                                                                                                              |

## Como escribir buenos tests (inteligentes, no ruido)

- **Reutiliza antes de escribir**: si el trait `CrudResourceTests` ya cubre el caso, no lo dupliques.
- Prueba **comportamiento observable** (respuesta, BD, props Inertia, permisos), no implementacion interna.
- Cubre: caso feliz, borde relevante (vacio, duplicado, limite de `per_page`), error de validacion, autorizacion. Nada de tests que solo repiten el framework.
- Datos con factories; `RefreshDatabase`; los tests usan sqlite en memoria (ver `phpunit.xml`) y no dependen de `public/build`.
- Un test = una razon para fallar. Nombres que describen la regla: `test_no_puedes_borrar_tu_propio_usuario`.
- Nunca borres, saltes ni debilites un test para que pase: arregla la causa. Si el test estaba mal, explica por que.
- Autorizacion siempre con permisos (`assignRole('admin')` o permisos concretos tras `php artisan crud:sync`), no con roles hardcodeados en la logica.

## Antes de terminar (definicion de hecho)

1. `vendor/bin/pint --dirty`
2. `pnpm types:generate` (si tocaste `app/Data`, enums o rutas)
3. `pnpm check` y `php artisan test` en verde
4. Si hubo UI: escenarios E2E afectados ejecutados por MCP y reportados como tabla
5. Resumen final honesto: que tests agregaste y resultados reales
