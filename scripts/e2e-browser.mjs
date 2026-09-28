// Abre TU navegador (Brave por defecto, o Edge/Chrome) con el puerto de depuracion 9333 para el MCP chrome-devtools.
// Usa un perfil aparte (.e2e-profile, ignorado por git): no toca tus pestanas ni sesiones. Uso:
//   pnpm e2e:browser            -> Brave
//   BROWSER=edge pnpm e2e:browser   |   BROWSER=chrome pnpm e2e:browser
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PORT = process.env.DEBUG_PORT ?? '9333';
const url = process.env.E2E_URL ?? 'http://127.0.0.1:8123/login';

const candidates = {
    brave: [
        'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
        'C:/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
        '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
        '/usr/bin/brave-browser',
    ],
    edge: [
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/usr/bin/microsoft-edge',
    ],
    chrome: [
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
    ],
};

const name = (process.env.BROWSER ?? 'brave').toLowerCase();
const executable = process.env.BROWSER_PATH ?? candidates[name]?.find((p) => existsSync(p));

if (!executable) {
    console.error(`No encontre el navegador "${name}". Define BROWSER_PATH con la ruta del ejecutable.`);
    process.exit(1);
}

// Seguridad: si el puerto ya responde, hay OTRO navegador depurable (posiblemente con tus sesiones reales).
const busy = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(
    () => true,
    () => false,
);
if (busy) {
    console.error(
        `El puerto ${PORT} ya esta en uso por otro navegador. Cierralo o usa DEBUG_PORT=<otro> (y ajusta .mcp.json).`,
    );
    process.exit(1);
}

const profile = path.resolve('.e2e-profile');
const child = spawn(
    executable,
    [
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${profile}`,
        '--no-first-run',
        '--no-default-browser-check',
        url,
    ],
    { detached: true, stdio: 'ignore' },
);
child.unref();

console.log(`${name} abierto con depuracion en http://127.0.0.1:${PORT} (perfil aislado: ${profile}).`);
console.log('El MCP "chrome-devtools" (.mcp.json) se conecta a ese puerto.');
