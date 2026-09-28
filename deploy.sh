#!/usr/bin/env bash
# Deploy ligero para servidores de bajos recursos. Uso: ./deploy.sh
# Recomendado: compilar el frontend en tu maquina/CI y subir public/build (evita instalar Node en el servidor).
set -euo pipefail

php artisan down --retry=30 || true

git pull --ff-only
composer install --no-dev --optimize-autoloader --no-interaction --classmap-authoritative

# Solo si compilas en el servidor (necesita ~1GB de RAM/swap temporal):
# npm ci && npm run build && rm -rf node_modules

php artisan migrate --force
php artisan crud:sync
php artisan optimize          # cachea config, rutas, eventos y vistas
php artisan queue:restart

php artisan up
echo "Deploy OK"
