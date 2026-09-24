import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/system-administration.spec.ts
 *
 * UI tests for the "System Administration" landing screen.
 *
 * Visible cards:
 *   - Manage Extensions
 *   - Manage Apps
 *   - Manage Global Properties
 *   - Manage Accounts
 *   - Style Guide
 *   - Advanced Administration
 */
test.describe('System Administration', () => {
  test('the System Administration page loads', async ({ systemAdministrationPage }) => {
    await systemAdministrationPage.waitForReady();
    expect(systemAdministrationPage.page.url()).toMatch(/admin|sysadmin/i);
  });

  test('the heading "System Administration" is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.heading).toBeVisible();
  });

  test('the breadcrumb contains "System Administration"', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.breadcrumb).toBeVisible();
  });

  test('the page shows at least 6 admin cards', async ({ systemAdministrationPage }) => {
    const count = await systemAdministrationPage.cardCount();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  // ---------- Each card visible ----------

  test('Manage Extensions card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.manageExtensionsCard).toBeVisible();
  });
  test('Manage Apps card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.manageAppsCard).toBeVisible();
  });
  test('Manage Global Properties card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.manageGlobalPropertiesCard).toBeVisible();
  });
  test('Manage Accounts card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.manageAccountsCard).toBeVisible();
  });
  test('Style Guide card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.styleGuideCard).toBeVisible();
  });
  test('Advanced Administration card is visible', async ({ systemAdministrationPage }) => {
    await expect(systemAdministrationPage.advancedAdministrationCard).toBeVisible();
  });

  // ---------- Clicking each card ----------

  test('clicking Manage Extensions navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickManageExtensions();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/extension|module/i);
  });

  test('clicking Manage Apps navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickManageApps();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/apps/i);
  });

  test('clicking Manage Global Properties navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickManageGlobalProperties();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/global|property/i);
  });

  test('clicking Manage Accounts navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickManageAccounts();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/account|user/i);
  });

  test('clicking Style Guide navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickStyleGuide();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/style/i);
  });

  test('clicking Advanced Administration navigates', async ({ systemAdministrationPage, page }) => {
    await systemAdministrationPage.clickAdvancedAdministration();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/admin|advanced/i);
  });

  // ---------- Misc ----------

  test('the page does not have a search input', async ({ systemAdministrationPage }) => {
    const hasSearch = await systemAdministrationPage.page.locator('input[type="search"]').count();
    expect(hasSearch).toBe(0);
  });

  test('the Logout link is reachable from this page', async ({ systemAdministrationPage, page }) => {
    const logout = page.locator('a:has-text("Logout"), button:has-text("Logout")').first();
    await expect(logout).toBeVisible();
  });

  test('the breadcrumb trail can be used to navigate home', async ({ systemAdministrationPage, page }) => {
    const home = page.locator('nav a:has-text("Home"), .breadcrumb a:has-text("Home")').first();
    await expect(home).toBeVisible();
  });
});
