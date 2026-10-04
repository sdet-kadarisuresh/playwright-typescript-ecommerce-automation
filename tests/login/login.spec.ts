
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('TC_LOGIN_001 - Valid user can log in', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true }))
      .toBeVisible();
  });

  test('TC_LOGIN_002 - Invalid password is rejected', async () => {
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage)
      .toContainText('Username and password do not match');
  });

  test('TC_LOGIN_003 - Empty credentials are rejected', async () => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage)
      .toContainText('Username is required');
  });

  test('TC_LOGIN_004 - Locked user cannot log in', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage)
      .toContainText('locked out');
  });
});
