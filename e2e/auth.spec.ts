import { expect, test } from '@playwright/test';
import { login, logout } from './helpers';

test('invitado es redirigido al login', async ({ page }) => {
    await page.goto('/users');
    await expect(page).toHaveURL(/\/login$/);
});

test('login con credenciales incorrectas muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo').fill('admin@example.com');
    await page.getByLabel('Contrasena').fill('mala-clave');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Credenciales incorrectas.')).toBeVisible();
});

test('login, dashboard con datos JSON tipados y logout', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: /Hola, Administrador/ })).toBeVisible();
    await expect(page.getByText('Permisos activos: 8')).toBeVisible();
    await logout(page, 'Administrador');
});

test('registro deshabilitado responde 404 con pagina de error', async ({ page }) => {
    const response = await page.goto('/register');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('La pagina que buscas no existe.')).toBeVisible();
});
