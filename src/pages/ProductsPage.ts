import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Products', { exact: true });
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async addProduct(productName: string): Promise<void> {
    const product = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });

    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(productName: string): Promise<void> {
    const product = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });

    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}