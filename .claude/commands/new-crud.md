---
description: Crea un recurso CRUD nuevo (generico) con sus tests y lo verifica
argument-hint: <NombreModelo> [descripcion de campos]
---

Crea el recurso CRUD `$ARGUMENTS` siguiendo `.ai/guidelines/00-generico-primero.md` y `02-backend.md`:

1. `php artisan make:crud <Nombre>` (genera modelo, migracion, factory, Definition, Data, test y registro en `config/crud.php`).
2. Completa migracion, `$fillable`, `columns()`/`fields()` con reglas reales, propiedades de `Data` y la factory.
   Si necesitas un tipo de campo/columna que no existe, extiende el enum y `FieldInput`/`CellValue` (no crees paginas ni controladores por recurso).
3. Ajusta `tests/Feature/Crud/<Nombre>CrudTest.php`: `validPayload()`, `invalidPayload()` realista y, si hay reglas de negocio propias
   (unicos, relaciones, `deleteBlockedReason`, `saved`), agrega tests especificos.
4. `php artisan migrate && php artisan crud:sync && pnpm types:generate`.
5. `vendor/bin/pint --dirty`, `pnpm check`, `php artisan test`. Todo verde antes de terminar.
6. Agrega un escenario en `e2e/SCENARIOS.md` solo si el recurso tiene comportamiento de UI distinto al CRUD estandar.
