# Optimizado para servidores de bajos recursos

Todo cambio debe respetar que esto corre en VPS de 512 MB - 1 GB de RAM y 1 vCPU.

- **Sin SSR** ni procesos Node en produccion: solo se sirve `public/build` (estatico, gzip/brotli en el servidor web). Node se usa unicamente para compilar.
- **Redis** para sesion/cache/colas (`SESSION_DRIVER=redis`, `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`); `REDIS_CLIENT=phpredis` en produccion. Alternativa sin Redis: `database` o `file` (ver `docs/DEPLOY.md`).
- **Colas**: un solo worker con limites (`queue:work --max-jobs=500 --max-time=3600 --memory=128`). Jobs pequenos; nada de cargar colecciones enormes en memoria (`chunk`, `cursor`, `lazy`).
- **Consultas**: paginar siempre, indexar columnas usadas en `where`/`orderBy`/`search`, precargar relaciones (`with()`), evitar `count()` innecesarios. En local `Model::shouldBeStrict()` detecta N+1 y atributos inexistentes.
- **Cache**: `php artisan optimize` en cada deploy (config, rutas, vistas, eventos). Cachea con `Cache::remember` lo caro y estable (permisos ya se cachean por Spatie).
- **Frontend**: paginas lazy, iconos registrados (tree-shaking), sin dependencias pesadas, imagenes optimizadas. Vigila el tamano de `npm run build`.
- **Logs**: `LOG_LEVEL=warning` en produccion; `LOG_STACK=daily` con rotacion corta si el disco es chico.
- **Dependencias**: antes de agregar un paquete (composer/npm) verifica que no exista ya una pieza generica en el proyecto y evalua su costo en RAM/bundle.
- Despliegue: `docs/DEPLOY.md` y `deploy.sh`.
