import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('should display registration page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/register');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
  });
});
