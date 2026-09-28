# Despliegue en servidores de bajos recursos (512 MB - 1 GB RAM)

## Principio

El servidor solo ejecuta **PHP-FPM + Nginx/Apache + MySQL + (Redis)**. El frontend se compila fuera y se sirve estatico desde `public/build`.

## Checklist de produccion

1. Compilar en local/CI: `npm ci && npm run build` y subir `public/build` (o compilar en el servidor con swap y luego `rm -rf node_modules`).
2. `.env` desde `.env.production.example` (`APP_DEBUG=false`, `LOG_LEVEL=warning`, `REDIS_CLIENT=phpredis`).
3. `./deploy.sh` (composer `--no-dev --classmap-authoritative`, `migrate --force`, `crud:sync`, `optimize`, `queue:restart`).
4. Permisos: `storage` y `bootstrap/cache` escribibles por el usuario de PHP-FPM.

## PHP-FPM (1 vCPU / 1 GB)

```ini
; pool www
pm = ondemand            ; o dynamic con pm.max_children = 4
pm.max_children = 4
pm.process_idle_timeout = 20s
pm.max_requests = 500

; php.ini
memory_limit = 128M
opcache.enable = 1
opcache.memory_consumption = 96
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0   ; requiere reiniciar php-fpm en cada deploy (deploy.sh + `systemctl reload php8.3-fpm`)
opcache.jit = off
realpath_cache_size = 4096K
```

## Servidor web

- Raiz del sitio: `public/`. Activar **gzip/brotli** para `js, css, svg, json` y cabeceras `Cache-Control: public, max-age=31536000, immutable` para `/build/assets/*` (nombres con hash).
- Apache: `public/.htaccess` ya incluido (mod_rewrite). Nginx: `try_files $uri $uri/ /index.php?$query_string;`.

## Redis (recomendado) o alternativas

| Recurso | Con Redis                | Sin Redis                                                               |
| ------- | ------------------------ | ----------------------------------------------------------------------- |
| Sesion  | `SESSION_DRIVER=redis`   | `file`                                                                  |
| Cache   | `CACHE_STORE=redis`      | `file` (o `database`)                                                   |
| Colas   | `QUEUE_CONNECTION=redis` | `database` (ya hay migracion de `jobs`) o `sync` si no hay jobs pesados |

Redis con `maxmemory 64mb` y `maxmemory-policy allkeys-lru` alcanza para un sitio pequeno.

## Worker de colas (supervisor/systemd)

```
php artisan queue:work --sleep=3 --tries=3 --max-jobs=500 --max-time=3600 --memory=96
```

Un solo worker; se reinicia solo al llegar a los limites (evita fugas de memoria). Programador: `* * * * * php artisan schedule:run`.

## MySQL

`innodb_buffer_pool_size=128M`, `max_connections=30`, `performance_schema=OFF` en 512 MB. Indexa columnas de busqueda/orden que agregues a los CRUD.

## Verificar

`php artisan about` (cache de config/rutas/eventos/vistas = CACHED) y `curl -I https://midominio.com/up` (health check).
