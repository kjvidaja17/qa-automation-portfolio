import { expect, test } from '@playwright/test';

test('UI-002: should allow an admin to log in and reach the protected dashboard', async ({ page }) => {
  await page.goto('https://automationintesting.online/');

  await page.getByRole('link', { name: 'Admin', exact: true }).click();

  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/admin(?:\/)?$/);
  await expect(page.getByRole('link', { name: 'Rooms' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: 'Report' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 10000 });
});
