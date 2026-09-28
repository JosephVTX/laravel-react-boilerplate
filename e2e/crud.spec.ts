import { expect, test } from '@playwright/test';
import { login } from './helpers';

test.beforeEach(async ({ page }) => {
    await login(page);
});

test('menu lateral generado desde el backend y navegacion entre recursos', async ({ page }) => {
    await page.getByRole('link', { name: 'Usuarios' }).click();
    await expect(page.getByRole('heading', { name: 'Usuarios' })).toBeVisible();
    await page.getByRole('link', { name: 'Roles' }).click();
    await expect(page.getByRole('heading', { name: 'Roles' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
});

test('busqueda y paginacion server-side', async ({ page }) => {
    await page.goto('/users');
    await expect(page.getByText(/1-15 de 21/)).toBeVisible();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText(/16-21 de 21/)).toBeVisible();

    await page.getByPlaceholder('Buscar...').fill('admin@example');
    await expect(page.getByText(/1-1 de 1/)).toBeVisible();
});

test('ordenar por columna alterna asc/desc', async ({ page }) => {
    await page.goto('/users');
    await page.getByRole('button', { name: 'Nombre' }).click();
    await expect(page).toHaveURL(/sort=name(&|$)/);
    await page.getByRole('button', { name: 'Nombre' }).click();
    await expect(page).toHaveURL(/sort=-name/);
});

test('crear, editar y eliminar un usuario con roles', async ({ page }) => {
    await page.goto('/users');

    // Validacion en cliente (zod)
    await page.getByRole('button', { name: 'Nuevo' }).click();
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Campo obligatorio').first()).toBeVisible();

    // Crear
    await page.getByLabel('Nombre *').fill('Persona E2E');
    await page.getByLabel('Correo *').fill('e2e@example.com');
    await page.getByLabel(/Contrasena/).fill('clave-segura-1');
    await page.getByRole('button', { name: 'user', exact: true }).click();
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Usuario creado.')).toBeVisible();

    await page.getByPlaceholder('Buscar...').fill('e2e@example.com');
    const row = page.getByRole('row', { name: /Persona E2E/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('user', { exact: true })).toBeVisible();

    // Error de servidor: correo duplicado
    await page.getByRole('button', { name: 'Nuevo' }).click();
    await page.getByLabel('Nombre *').fill('Duplicado');
    await page.getByLabel('Correo *').fill('e2e@example.com');
    await page.getByLabel(/Contrasena/).fill('clave-segura-1');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    // Editar
    await row.getByRole('button', { name: 'Editar' }).click();
    await page.getByLabel('Nombre *').fill('Persona Editada');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Usuario actualizado.')).toBeVisible();
    await expect(page.getByRole('row', { name: /Persona Editada/ })).toBeVisible();

    // Eliminar
    await page
        .getByRole('row', { name: /Persona Editada/ })
        .getByRole('button', { name: 'Eliminar' })
        .click();
    await page.getByRole('button', { name: 'Eliminar', exact: true }).last().click();
    await expect(page.getByText('Usuario eliminado.')).toBeVisible();
    await expect(page.getByText('Sin resultados')).toBeVisible();
});

test('no puedes eliminar tu propio usuario', async ({ page }) => {
    await page.goto('/users');
    await page.getByPlaceholder('Buscar...').fill('admin@example.com');
    await page
        .getByRole('row', { name: /admin@example.com/ })
        .getByRole('button', { name: 'Eliminar' })
        .click();
    await page.getByRole('button', { name: 'Eliminar', exact: true }).last().click();
    await expect(page.getByText('No puedes eliminar tu propio usuario.')).toBeVisible();
});

test('crear un rol con permisos', async ({ page }) => {
    await page.goto('/roles');
    await page.getByRole('button', { name: 'Nuevo' }).click();
    await page.getByLabel('Nombre *').fill('editor-e2e');
    await page.getByRole('button', { name: 'users.view' }).click();
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('Rol creado.')).toBeVisible();
    await expect(page.getByRole('row', { name: /editor-e2e/ }).getByText('users.view')).toBeVisible();
});
