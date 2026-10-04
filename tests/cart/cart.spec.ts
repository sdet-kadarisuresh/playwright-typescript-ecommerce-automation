import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';

test.describe('Shopping cart', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.loginSuccessfully('standard_user', 'secret_sauce');

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.addProduct('Sauce Labs Bike Light');
    await cartPage.open();

    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC_CART_001 - Cart displays added products', async () => {
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(cartPage.page.getByText('Sauce Labs Bike Light')).toBeVisible();
  });

  test('TC_CART_002 - Remove one product from cart', async () => {
    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.page.getByText('Sauce Labs Backpack')).toHaveCount(0);
    await expect(cartPage.page.getByText('Sauce Labs Bike Light')).toBeVisible();
  });

  test('TC_CART_003 - Continue shopping returns to products', async ({ page }) => {
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('TC_CART_004 - Checkout opens customer information page', async ({ page }) => {
    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(
      page.getByText('Checkout: Your Information'),
    ).toBeVisible();
  });
});