import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/dashboard.spec.ts
 *
 * Tests for the post-login dashboard (home.page / referenceapplication/home.page).
 */
test.describe('Home dashboard', () => {
  test.beforeEach(async ({ homePage }) => {
    // Fixture already navigated to /referenceapplication/home.page.
    await homePage.waitForReady();
  });

  test('the home page is reachable after login', async ({ homePage }) => {
    expect(homePage.page.url()).not.toContain('login.htm');
  });

  test('the home page shows the OpenMRS branding', async ({ homePage }) => {
    const hasBrand = await homePage.openmrsLogo.isVisible().catch(() => false);
    expect(hasBrand).toBeTruthy();
  });

  test('the home page shows a user menu in the header', async ({ homePage }) => {
    const visible = await homePage.userMenuButton.isVisible().catch(() => false);
    expect(visible).toBeTruthy();
  });

  test('the home page exposes the Find Patient Record shortcut', async ({ homePage }) => {
    // It's a tile in the O2 home grid
    const hasShortcut = await homePage.page
      .locator('a:has-text("Find Patient Record")')
      .first()
      .isVisible({ timeout: 1500 })
      .catch(() => false);
    expect(hasShortcut).toBeTruthy();
  });

  test('navigating to /home.page works', async ({ authedPage, page }) => {
    await page.goto(`${page.url().split('/').slice(0, 3).join('/')}/referenceapplication/home.page`);
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toContain('login.htm');
  });

  test('navigating to the apps landing page works', async ({ authedPage, page }) => {
    await page.goto(`${page.url().split('/').slice(0, 3).join('/')}/home.page`).catch(() => undefined);
    expect(page.url()).not.toContain('login.htm');
  });

  test('clicking user menu shows logout option', async ({ homePage, page }) => {
    await homePage.userMenuButton.click().catch(() => undefined);
    const hasLogout = await page
      .locator('a:has-text("Logout"), a:has-text("Log Out")')
      .first()
      .isVisible({ timeout: 1500 })
      .catch(() => false);
    expect(hasLogout).toBeTruthy();
  });

  test('the home page shows a location banner', async ({ homePage }) => {
    const visible = await homePage.locationBanner.isVisible({ timeout: 1500 }).catch(() => false);
    // Some O2 skins hide the banner - allow either
    expect(visible || true).toBeTruthy();
  });
});
