import { expect, type Page } from '@playwright/test';

export async function login(page: Page, email = 'admin@example.com', password = 'password') {
    await page.goto('/login');
    await page.getByLabel('Correo').fill(email);
    await page.getByLabel('Contrasena').fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/');
}

export async function logout(page: Page, userName: string) {
    await page.getByRole('button', { name: userName }).click();
    await page.getByRole('button', { name: 'Cerrar sesion' }).click();
    await expect(page).toHaveURL(/\/login$/);
}
