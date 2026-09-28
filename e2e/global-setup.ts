import { execSync } from 'node:child_process';
import { e2eEnv } from '../playwright.config';

/** Recrea y siembra la BD E2E antes de la suite (requiere `npm run build` previo). */
export default function globalSetup() {
    const env = { ...process.env, ...e2eEnv };
    execSync('php artisan migrate:fresh --seed --force --no-interaction', { stdio: 'inherit', env });
}
