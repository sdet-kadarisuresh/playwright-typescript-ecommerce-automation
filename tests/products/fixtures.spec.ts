import { test, expect } from '../../src/fixtures/testFixtures';

test('TC_FIXTURE_001 - Authenticated user sees products', async ({
  authenticatedPage,
}) => {
  await expect(authenticatedPage).toHaveURL(/inventory\.html/);
  await expect(
    authenticatedPage.getByText('Products', { exact: true }),
  ).toBeVisible();
});

test('TC_FIXTURE_002 - Authenticated user sees six products', async ({
  authenticatedPage,
  productsPage,
}) => {
  await expect(authenticatedPage).toHaveURL(/inventory\.html/);
  await expect(productsPage.inventoryItems).toHaveCount(6);
});