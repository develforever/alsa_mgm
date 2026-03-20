import { test, expect } from '@playwright/test';

test.describe('SmartList Products', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to assembly products
    await page.goto('/assembly/products');
  });

  test('should load product list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Products'); // Adjust based on real title
    await expect(page.getByTestId('table-row')).toBeVisible();
  });

  test('should open sidebar on row click', async ({ page }) => {
    await page.getByTestId('table-row').first().click();
    await expect(page.getByTestId('sidebar-view-card')).toBeVisible();
  });

  test('should handle multi-selection and close sidebar', async ({ page }) => {
    // 1. Open sidebar
    await page.getByTestId('table-row').nth(0).click();
    await expect(page.getByTestId('sidebar-view-card')).toBeVisible();

    // 2. Select another row via checkbox
    await page.getByTestId('table-select-row-checkbox').nth(1).click();
    
    // 3. Sidebar should close automatically
    await expect(page.getByTestId('sidebar-view-card')).toBeHidden();
  });

  test('should highlight active row', async ({ page }) => {
    await page.getByTestId('table-row').first().click();
    await expect(page.getByTestId('table-row').first()).toHaveClass(/active-row/);
  });
});
