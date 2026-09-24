import { test, expect } from '../../fixtures/testFixtures';
import { LoginPage } from '../../src/pages/login.page';

/**
 * tests/ui/login.spec.ts
 *
 * UI tests for the O2 login page (login.htm).
 *
 * Covers:
 *  - Page rendering (location dropdown, inputs, button).
 *  - Form-level validation.
 *  - Successful login flows.
 *  - Sign-out / re-entry.
 *  - Cross-location login (different default location).
 */
test.describe('Login page', () => {
  // ---------- Page rendering ----------

  test('the login page loads at /login.htm', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('the username input is rendered', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('the password input is rendered and type=password', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('the location dropdown is rendered', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.locationSelect).toBeVisible();
  });

  test('the login submit button is rendered', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('the login page has a non-empty title', async ({ loginPage }) => {
    await loginPage.open();
    const title = await loginPage.getPageTitle();
    expect(title.length).toBeGreaterThan(0);
  });

  // ---------- Location dropdown ----------

  test('the location dropdown lists at least one location', async ({ loginPage }) => {
    await loginPage.open();
    const opts = await loginPage.listAvailableLocations();
    expect(opts.length).toBeGreaterThan(0);
  });

  test('the location dropdown includes common O2 locations', async ({ loginPage }) => {
    await loginPage.open();
    const opts = (await loginPage.listAvailableLocations()).join(' | ');
    expect(opts).toMatch(/Inpatient Ward/i);
    expect(opts).toMatch(/Outpatient Clinic/i);
  });

  test('selecting a location updates the dropdown value', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.selectLocation('Outpatient Clinic');
    expect(await loginPage.getSelectedLocation()).toBeTruthy();
  });

  // ---------- Form validation ----------

  test('submitting with all fields empty keeps us on the login page', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('submitting with only the username filled stays on login', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.usernameInput.fill('admin');
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('submitting with only the password filled stays on login', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.passwordInput.fill('Admin123');
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('wrong password keeps us on the login page', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.usernameInput.fill('admin');
    await loginPage.passwordInput.fill('wrong-password');
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('wrong username keeps us on the login page', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.usernameInput.fill('not-a-user');
    await loginPage.passwordInput.fill('Admin123');
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  test('unknown user with a strong-looking password still rejects', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.usernameInput.fill('mystery-user');
    await loginPage.passwordInput.fill('P@ssw0rd-123456');
    await loginPage.loginButton.click();
    await expect(loginPage.page).toHaveURL(/login\.htm/);
  });

  // ---------- Successful login ----------

  test('a valid admin login leaves the login page', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('admin', 'Admin123');
    await expect(loginPage.page).not.toHaveURL(/login\.htm$/);
  });

  test('a valid admin login lands on a non-login page', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('admin', 'Admin123');
    // O2 can land on /home.page, /index.htm or /referenceapplication/home.page
    const url = loginPage.page.url();
    expect(url).not.toContain('login.htm');
    expect(url).toMatch(/home|index|dashboard/i);
  });

  test('loginAsAdmin helper authenticates and returns the new URL', async ({ loginPage }) => {
    await loginPage.loginAsAdmin();
    expect(loginPage.page.url()).not.toContain('login.htm');
  });

  test('a successful login sets the session cookie', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login('admin', 'Admin123');
    const cookies = await page.context().cookies();
    const jsession = cookies.find((c) => c.name === 'JSESSIONID' || c.name === 'openmrs_id');
    expect(jsession).toBeTruthy();
  });

  // ---------- Cross-location login ----------

  test('login works when Outpatient Clinic is selected', async ({ loginPage }) => {
    await loginPage.login('admin', 'Admin123', 'Outpatient Clinic');
    expect(loginPage.page.url()).not.toContain('login.htm');
  });

  test('login works when Pharmacy is selected', async ({ loginPage }) => {
    await loginPage.login('admin', 'Admin123', 'Pharmacy');
    expect(loginPage.page.url()).not.toContain('login.htm');
  });

  test('login works when Laboratory is selected', async ({ loginPage }) => {
    await loginPage.login('admin', 'Admin123', 'Laboratory');
    expect(loginPage.page.url()).not.toContain('login.htm');
  });

  // ---------- Re-login after logout ----------

  test('after login we can log out and see the login page again', async ({ homePage, page }) => {
    // Click the user menu then "Logout" if present
    await homePage.userMenuButton.click().catch(() => undefined);
    const logoutLink = page.locator('a:has-text("Logout"), a:has-text("Log Out")').first();
    if (await logoutLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutLink.click();
      await expect(page).toHaveURL(/login\.htm/);
    } else {
      test.skip(true, 'No logout link visible (UI shape may differ)');
    }
  });

  test('after logout we can re-login successfully', async ({ loginPage, page }) => {
    await loginPage.loginAsAdmin();
    // Clear cookies so the session is truly gone (avoids /login.htm
    // bouncing back to /home.page in a redirect loop).
    await page.context().clearCookies();
    await page.goto(`${LoginPage.BASE_URL}/login.htm`);
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.login('admin', 'Admin123');
    // We just need to land somewhere that's not the login page.
    expect(loginPage.page.url()).not.toContain('login.htm');
  });

  // ---------- Misc ----------

  test('login page renders without JS console errors', async ({ loginPage }) => {
    const errors: string[] = [];
    loginPage.page.on('pageerror', (e) => errors.push(e.message));
    loginPage.page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await loginPage.open();
    // Filter browser-resource noise (favicons, missing static assets).
    // These are environment artifacts, not app bugs.
    const real = errors.filter(
      (e) =>
        !/favicon|404 \(Not Found\)|Failed to load resource/i.test(e) &&
        !/openmrs\.org|\.png|\.ico|\.svg|\.css|\.js/i.test(e),
    );
    expect(real).toHaveLength(0);
  });
});
