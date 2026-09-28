# Escenarios E2E (ejecutados por la IA con el MCP `chrome-devtools`)

Base: `http://127.0.0.1:8123`. Usuario admin: `admin@example.com` / `password`. La BD se recrea con 21 usuarios
(1 admin + 20 con rol `user` sin permisos) cada vez que arranca `pnpm e2e:server`.

Como ejecutar cada paso con el MCP: `navigate_page`, `take_snapshot` (obtiene los `uid` de los elementos),
`click`, `fill`, `fill_form`, `wait_for` (texto esperado), `list_console_messages` y `list_network_requests`.
**Cada escenario termina bien solo si: todas las verificaciones se cumplen, NO hay errores en consola y NO hay
respuestas 5xx en red.** Reporta una tabla `escenario | OK/FALLO | detalle`.

## Preparacion (una vez)

1. Terminal A: `pnpm e2e:server` (compila, recrea la BD `laravel_boilerplate_e2e` y sirve en :8123).
2. Terminal B: `pnpm e2e:browser` (Brave por defecto; `BROWSER=edge pnpm e2e:browser` para Edge).
3. El MCP se conecta a `http://127.0.0.1:9333` (ver `.mcp.json`). Confirma con `list_pages`.

## A. Autenticacion

- **A1 Invitado redirigido:** ir a `/users` -> la URL final es `/login`.
- **A2 Credenciales incorrectas:** en `/login` llenar `admin@example.com` / `mala-clave`, pulsar "Entrar" -> aparece "Credenciales incorrectas." y sigue en `/login`.
- **A3 Login + dashboard:** login correcto (si vienes de A1, Laravel redirige a la URL "intended" `/users`; navega a `/`) -> URL `/`; titulo "Hola, Administrador"; texto "Permisos activos: 8"; chip de rol `admin`. En red hay un `GET /api/me` con 200.
- **A4 Logout:** abrir el menu del usuario (boton "Administrador") -> "Cerrar sesion" -> URL `/login`.
- **A5 Registro deshabilitado:** ir a `/register` -> status 404 y texto "La pagina que buscas no existe.".

## B. CRUD generico (login como admin antes de cada escenario)

- **B1 Menu generado:** el sidebar muestra "Inicio", "Usuarios", "Roles". Click en Usuarios -> heading "Usuarios"; click en Roles -> heading "Roles" y una celda `admin`.
- **B2 Busqueda y paginacion:** `/users` muestra "1-15 de 21"; ir a pagina 2 -> URL con `page=2` y "16-21 de 21"; escribir `admin@example` en "Buscar..." -> "1-1 de 1".
- **B3 Orden:** click en cabecera "Nombre" -> URL con `sort=name`; segundo click -> `sort=-name`; tercer click -> vuelve al orden por defecto (sin `sort`).
- **B4 Crear usuario:**
    1. "Nuevo" -> "Guardar" vacio -> aparece "Campo obligatorio" (validacion cliente).
    2. Llenar Nombre `Persona E2E`, Correo `e2e@example.com`, Contrasena `clave-segura-1`, activar el rol `user`, "Guardar" -> toast "Usuario creado.".
    3. Buscar `e2e@example.com` -> la fila muestra `Persona E2E` con badge `user`.
- **B5 Error de servidor:** "Nuevo" con el mismo correo `e2e@example.com` -> el modal muestra error de correo duplicado (no se cierra). "Cancelar".
- **B6 Editar:** editar la fila (icono lapiz), cambiar nombre a `Persona Editada`, dejar contrasena vacia, "Guardar" -> toast "Usuario actualizado." y la fila refleja el nombre.
- **B7 Eliminar:** icono papelera de esa fila -> confirmar "Eliminar" -> toast "Usuario eliminado." y "Sin resultados".
- **B8 No borrarse a si mismo:** buscar `admin@example.com`, eliminar y confirmar -> toast de error "No puedes eliminar tu propio usuario.".
- **B9 Rol con permisos:** en `/roles`, "Nuevo", nombre `editor-e2e`, activar `users.view`, "Guardar" -> toast "Rol creado." y la fila muestra el badge `users.view`.

## C. Permisos

- **C1 Usuario sin permisos:** en `/users` (admin) buscar `@`, tomar el correo de un usuario distinto del admin (rol `user`), cerrar sesion e iniciar con ese correo y `password` -> el sidebar NO muestra "Usuarios" ni "Roles"; ir a `/users` -> status 403 y texto "No tienes permiso para ver esta pagina.".

## D. Salud general (al final)

- `list_console_messages`: sin errores. `list_network_requests`: sin 4xx/5xx inesperados (salvo los 404/403 provocados a proposito en A5/C1).
- Opcional: `lighthouse_audit` en `/login` y `/users` (accesibilidad y buenas practicas) y reportar puntuaciones.
