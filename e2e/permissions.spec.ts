import { expect, test } from '@playwright/test';
import { login, logout } from './helpers';

test('usuario sin permisos no ve recursos en el menu y recibe 403', async ({ page }) => {
    // Usuarios sembrados por factory: rol `user` sin permisos, password = "password".
    await login(page);
    await page.goto('/users');
    await page.getByPlaceholder('Buscar...').fill('@');
    const emails = await page.getByRole('cell', { name: /@/ }).allInnerTexts();
    const other = emails.find((email) => email !== 'admin@example.com');
    expect(other).toBeTruthy();
    await logout(page, 'Administrador');

    await login(page, other ?? '');
    await expect(page.getByRole('link', { name: 'Usuarios' })).toHaveCount(0);
    const response = await page.goto('/users');
    expect(response?.status()).toBe(403);
    await expect(page.getByText('No tienes permiso para ver esta pagina.')).toBeVisible();
});
