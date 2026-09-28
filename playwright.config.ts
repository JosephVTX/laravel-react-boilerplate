import { defineConfig, devices } from '@playwright/test';

const PORT = 8123;

/** Entorno aislado para E2E: BD propia, sesion/cache en archivos (no toca tu BD ni Redis de desarrollo). */
export const e2eEnv = {
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

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list']],
    globalSetup: './e2e/global-setup.ts',
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: `php artisan serve --host=127.0.0.1 --port=${PORT} --no-reload`,
        url: `http://127.0.0.1:${PORT}/up`,
        reuseExistingServer: false,
        timeout: 60_000,
        env: e2eEnv,
    },
});
