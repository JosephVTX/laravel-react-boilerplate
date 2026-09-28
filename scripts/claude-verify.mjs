// Hook `Stop` de Claude Code: impide dar la tarea por terminada si el cambio no esta verificado.
//  1. Sin cambios de codigo            -> pasa (no gasta tiempo).
//  2. Codigo PHP sin tests nuevos/editados, o paginas/componentes sin escenario E2E -> bloquea pidiendo tests.
//  3. Corre Pint (autofix de archivos tocados), `pnpm check` y `php artisan test`; si algo falla -> bloquea con el error.
// Exit 2 = Claude recibe stderr y continua trabajando. Maximo 3 bloqueos por mismo estado (evita bucles infinitos).
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const STATE = '.claude/verify-state.json';
const MAX_BLOCKS = 3;

const sh = (cmd) => spawnSync(cmd, { shell: true, encoding: 'utf8', env: { ...process.env, CI: '1' } });
const changedFiles = execSync('git status --porcelain -uall', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/^"|"$/g, '').split(' -> ').pop());

const generated = /^resources\/js\/(types\/generated\.d\.ts|routes|actions|wayfinder)/;
const phpCode = changedFiles.filter(
    (f) => /^(app|routes|config|database\/migrations)\//.test(f) && f.endsWith('.php'),
);
const jsCode = changedFiles.filter((f) => /^resources\/js\//.test(f) && !generated.test(f));
const uiFlows = jsCode.filter((f) => /^resources\/js\/(pages|components|hooks)\//.test(f));
const testsTouched = changedFiles.some((f) => /^tests\//.test(f));
const scenariosTouched = changedFiles.includes('e2e/SCENARIOS.md');

if (phpCode.length === 0 && jsCode.length === 0) process.exit(0);

// Estado para limitar reintentos sobre el mismo diff.
const fingerprint = createHash('sha1')
    .update(execSync('git diff HEAD', { encoding: 'utf8', maxBuffer: 1 << 26 }) + changedFiles.join('|'))
    .digest('hex');
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
const attempts = state.fingerprint === fingerprint ? state.attempts : 0;

const block = (message) => {
    writeFileSync(STATE, JSON.stringify({ fingerprint, attempts: attempts + 1 }));
    process.stderr.write(`${message}\n\nReglas: .ai/guidelines/06-testing.md\n`);
    process.exit(2);
};

if (attempts >= MAX_BLOCKS) {
    process.stderr.write(
        'claude-verify: limite de bloqueos alcanzado; se permite terminar. Reporta al usuario lo que falte.\n',
    );
    process.exit(0);
}

const problems = [];
if (phpCode.length > 0 && !testsTouched) {
    problems.push(
        `Cambiaste codigo PHP (${phpCode.slice(0, 5).join(', ')}) sin agregar ni actualizar tests en tests/. ` +
            'Escribe los tests que correspondan (recurso CRUD nuevo -> tests/Feature/Crud/*CrudTest.php con el trait CrudResourceTests; ' +
            'logica nueva -> Feature/Unit; bug -> test de regresion).',
    );
}
if (uiFlows.length > 0 && !scenariosTouched && !testsTouched) {
    problems.push(
        `Cambiaste UI (${uiFlows.slice(0, 5).join(', ')}) sin actualizar e2e/SCENARIOS.md. ` +
            'Agrega/ajusta el escenario y ejecutalo con el MCP chrome-devtools (ver .ai/guidelines/05-e2e-mcp.md).',
    );
}
if (problems.length > 0) block(problems.join('\n\n'));

// Verificacion automatica.
if (phpCode.length > 0) sh('vendor/bin/pint --dirty');
const failures = [];
if (jsCode.length > 0 || phpCode.length > 0) {
    const js = sh('pnpm check');
    if (js.status !== 0) failures.push(`pnpm check fallo:\n${(js.stdout + js.stderr).slice(-2500)}`);
}
if (phpCode.length > 0 || testsTouched) {
    const php = sh('php artisan test');
    if (php.status !== 0) failures.push(`php artisan test fallo:\n${(php.stdout + php.stderr).slice(-3000)}`);
}
if (failures.length > 0)
    block(`La verificacion automatica fallo. Corrige y vuelve a intentar.\n\n${failures.join('\n\n')}`);

writeFileSync(STATE, JSON.stringify({}));
process.exit(0);
