import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';

test.describe('Products page', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    productsPage = new ProductsPage(page);
  });

  test('TC_PRODUCTS_001 - Products are displayed', async () => {
    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('TC_PRODUCTS_002 - Products can be sorted by name A to Z', async () => {
    await productsPage.sortBy('az');

    const names = await productsPage.page
      .locator('.inventory_item_name')
      .allTextContents();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('TC_PRODUCTS_003 - Products can be sorted by price low to high', async () => {
    await productsPage.sortBy('lohi');

    const prices = (await productsPage.page
      .locator('.inventory_item_price')
      .allTextContents())
      .map(price => Number(price.replace('$', '')));

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC_PRODUCTS_004 - Add product to cart', async ({ page }) => {
    await productsPage.addProduct('Sauce Labs Backpack');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC_PRODUCTS_005 - Remove product from cart on products page', async ({ page }) => {
    await productsPage.addProduct('Sauce Labs Backpack');
    await productsPage.removeProduct('Sauce Labs Backpack');

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC_PRODUCTS_006 - Cart opens successfully', async ({ page }) => {
    await productsPage.openCart();

    await expect(page).toHaveURL(/cart.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
  });
});