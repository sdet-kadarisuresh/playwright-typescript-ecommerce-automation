import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';

test.describe('Checkout workflow', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    const productsPage = new ProductsPage(page);
    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    checkoutPage = new CheckoutPage(page);
  });

  test('TC_CHECKOUT_001 - Required customer information is validated', async ({ page }) => {
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toContainText('First Name is required');
  });

  test('TC_CHECKOUT_002 - Missing last name is validated', async ({ page }) => {
    await checkoutPage.enterCustomerInformation('Sk', '', '500001');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toContainText('Last Name is required');
  });

  test('TC_CHECKOUT_003 - Missing postal code is validated', async () => {
    await checkoutPage.enterCustomerInformation('Sk', 'Tester', '');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toContainText('Postal Code is required');
  });

  test('TC_CHECKOUT_004 - Valid information opens order overview', async ({ page }) => {
    await checkoutPage.enterCustomerInformation('Sk', 'Tester', '500001');
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('TC_CHECKOUT_005 - Order can be completed successfully', async ({ page }) => {
    await checkoutPage.enterCustomerInformation('Sk', 'Tester', '500001');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('TC_CHECKOUT_006 - Completed order shows confirmation', async ({ page }) => {
    await checkoutPage.enterCustomerInformation('Sk', 'Tester', '500001');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(page.getByText('Your order has been dispatched'))
      .toBeVisible();
    await expect(page.getByRole('button', { name: 'Back Home' }))
      .toBeVisible();
  });
});