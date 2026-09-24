import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/home-dashboard.spec.ts
 *
 * UI tests for the O2 Home / dashboard grid of app tiles.
 *
 * Visible tiles:
 *   - Find Patient Record
 *   - Awaiting Admission
 *   - Active Visits
 *   - Register a patient
 *   - Capture Vitals
 *   - Appointment Scheduling
 *   - Reports
 *   - Data Management
 *   - Configure Metadata
 *   - System Administration
 */
test.describe('Home dashboard', () => {
  test.beforeEach(async ({ homePage }) => {
    // The fixture already navigated to /referenceapplication/home.page
    // and waited for the app tiles to render.
    await homePage.waitForReady();
  });

  test('the home page loads after login', async ({ homePage }) => {
    await homePage.waitForReady();
    expect(homePage.page.url()).not.toContain('login.htm');
  });

  test('the home page shows the OpenMRS header logo', async ({ homePage }) => {
    await expect(homePage.openmrsLogo).toBeVisible();
  });

  test('the home page shows the admin user', async ({ homePage }) => {
    await expect(homePage.page.locator('text=admin').first()).toBeVisible();
  });

  test('the home page shows the active location (Inpatient Ward)', async ({ homePage }) => {
    await expect(homePage.page.locator('text=Inpatient Ward').first()).toBeVisible();
  });

  test('a Logout button is present in the header', async ({ homePage }) => {
    await expect(homePage.page.locator('a:has-text("Logout"), button:has-text("Logout")').first()).toBeVisible();
  });

  // ---- each app tile ----

  test('the Find Patient Record app tile is visible', async ({ homePage }) => {
    await expect(homePage.findPatientRecordApp).toBeVisible();
  });
  test('the Awaiting Admission app tile is visible', async ({ homePage }) => {
    await expect(homePage.awaitingAdmissionApp).toBeVisible();
  });
  test('the Active Visits app tile is visible', async ({ homePage }) => {
    await expect(homePage.activeVisitsApp).toBeVisible();
  });
  test('the Register a patient app tile is visible', async ({ homePage }) => {
    await expect(homePage.registerPatientApp).toBeVisible();
  });
  test('the Capture Vitals app tile is visible', async ({ homePage }) => {
    await expect(homePage.captureVitalsApp).toBeVisible();
  });
  test('the Appointment Scheduling app tile is visible', async ({ homePage }) => {
    await expect(homePage.appointmentSchedulingApp).toBeVisible();
  });
  test('the Reports app tile is visible', async ({ homePage }) => {
    await expect(homePage.reportsApp).toBeVisible();
  });
  test('the Data Management app tile is visible', async ({ homePage }) => {
    await expect(homePage.dataManagementApp).toBeVisible();
  });
  test('the Configure Metadata app tile is visible', async ({ homePage }) => {
    await expect(homePage.configureMetadataApp).toBeVisible();
  });
  test('the System Administration app tile is visible', async ({ homePage }) => {
    await expect(homePage.systemAdministrationApp).toBeVisible();
  });

  // ---- navigation via tiles ----

  test('clicking Find Patient Record navigates to the patient search', async ({ homePage }) => {
    await homePage.clickFindPatientRecord();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/patient-search|findPatient/i);
  });

  test('clicking Active Visits navigates to the active-visits page', async ({ homePage }) => {
    await homePage.clickActiveVisits();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/activeVisits/i);
  });

  test('clicking Register a patient opens the registration wizard', async ({ homePage }) => {
    await homePage.clickRegisterPatient();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/register|patient-registration/i);
  });

  test('clicking Capture Vitals opens the capture-vitals screen', async ({ homePage }) => {
    await homePage.clickCaptureVitals();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/vitals|capture/i);
  });

  test('clicking Appointment Scheduling navigates to appointments', async ({ homePage }) => {
    await homePage.clickAppointmentScheduling();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/appointment/i);
  });

  test('clicking Configure Metadata navigates to metadata admin', async ({ homePage }) => {
    await homePage.clickConfigureMetadata();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/configure-metadata|metadata/i);
  });

  test('clicking System Administration navigates to admin', async ({ homePage }) => {
    await homePage.clickSystemAdministration();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/admin|sysadmin/i);
  });

  test('clicking Data Management navigates to data management', async ({ homePage }) => {
    await homePage.clickDataManagement();
    await homePage.page.waitForLoadState('domcontentloaded');
    expect(homePage.page.url()).toMatch(/datamanagement|data-management|data\.htm/i);
  });

  // ---- breadcrumb ----

  test('the breadcrumb shows "Home"', async ({ homePage }) => {
    await expect(homePage.page.locator('nav a:has-text("Home")').first()).toBeVisible();
  });
});
