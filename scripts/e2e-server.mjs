// Levanta la app en un entorno E2E aislado: BD propia (laravel_boilerplate_e2e), sesion/cache en archivos, puerto 8123.
// Uso: pnpm e2e:server   (requiere `pnpm build` previo; recrea y siembra la BD en cada arranque)
import { spawn, spawnSync } from 'node:child_process';

const PORT = process.env.E2E_PORT ?? '8123';
const env = {
    ...process.env,
    APP_ENV: 'local',
    APP_DEBUG: 'true',
    APP_URL: `http://127.0.0.1:${PORT}`,
    DB_DATABASE: 'laravel_boilerplate_e2e',
    SESSION_DRIVER: 'file',
    CACHE_STORE: 'file',
    QUEUE_CONNECTION: 'sync',
    ALLOW_REGISTRATION: 'false',
    AUTH_THROTTLE_PER_MINUTE: '1000',
};

const run = (cmd, args) =>
    spawnSync(cmd, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });

const dbUser = env.DB_USERNAME ?? 'root';
const dbPass = env.DB_PASSWORD ? `-p${env.DB_PASSWORD}` : '';
spawnSync(
    `mysql -u${dbUser} ${dbPass} -e "CREATE DATABASE IF NOT EXISTS laravel_boilerplate_e2e CHARACTER SET utf8mb4;"`,
    { stdio: 'inherit', env, shell: true },
);

const migrated = run('php', ['artisan', 'migrate:fresh', '--seed', '--force', '--no-interaction']);
if (migrated.status !== 0) process.exit(migrated.status ?? 1);

console.log(`\nApp E2E lista en http://127.0.0.1:${PORT}  (admin@example.com / password)\n`);
const server = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', `--port=${PORT}`, '--no-reload'], {
    stdio: 'inherit',
    env,
});
server.on('exit', (code) => process.exit(code ?? 0));
