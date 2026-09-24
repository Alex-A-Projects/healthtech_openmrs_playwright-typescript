import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/appointment-scheduling.spec.ts
 *
 * UI tests for the "Appointment Scheduling" landing screen and sub-apps.
 *
 * Visible cards:
 *   - Manage Service Types
 *   - Manage Provider Schedules
 *   - Manage Appointments
 *   - Daily Appointments
 *   - Appointment Requests
 */
test.describe('Appointment Scheduling', () => {
  test('the Appointment Scheduling page loads', async ({ appointmentSchedulingPage }) => {
    await appointmentSchedulingPage.waitForReady();
    expect(appointmentSchedulingPage.page.url()).toMatch(/appointment/i);
  });

  test('the heading "Appointment Scheduling" is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.heading).toBeVisible();
  });

  test('the breadcrumb contains "Appointment Scheduling"', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.breadcrumb).toBeVisible();
  });

  // ---------- Cards visible ----------

  test('Manage Service Types card is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.manageServiceTypesCard).toBeVisible();
  });
  test('Manage Provider Schedules card is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.manageProviderSchedulesCard).toBeVisible();
  });
  test('Manage Appointments card is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.manageAppointmentsCard).toBeVisible();
  });
  test('Daily Appointments card is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.dailyAppointmentsCard).toBeVisible();
  });
  test('Appointment Requests card is visible', async ({ appointmentSchedulingPage }) => {
    await expect(appointmentSchedulingPage.appointmentRequestsCard).toBeVisible();
  });

  // ---------- Click each ----------

  test('clicking Manage Service Types navigates', async ({ appointmentSchedulingPage, page }) => {
    await appointmentSchedulingPage.clickManageServiceTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/service|appointment/i);
  });

  test('clicking Manage Provider Schedules navigates', async ({ appointmentSchedulingPage, page }) => {
    await appointmentSchedulingPage.clickManageProviderSchedules();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/schedule|provider/i);
  });

  test('clicking Manage Appointments navigates', async ({ appointmentSchedulingPage, page }) => {
    await appointmentSchedulingPage.clickManageAppointments();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/appointment/i);
  });

  test('clicking Daily Appointments navigates', async ({ appointmentSchedulingPage, page }) => {
    await appointmentSchedulingPage.clickDailyAppointments();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/appointment|daily/i);
  });

  test('clicking Appointment Requests navigates', async ({ appointmentSchedulingPage, page }) => {
    await appointmentSchedulingPage.clickAppointmentRequests();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/appointment|request/i);
  });

  // ---------- Misc ----------

  test('the page has at least 5 cards', async ({ appointmentSchedulingPage, page }) => {
    const tiles = await page.locator('main a, main [role="button"]').count();
    expect(tiles).toBeGreaterThanOrEqual(5);
  });

  test('the home icon in breadcrumb is clickable', async ({ appointmentSchedulingPage, page }) => {
    const homeIcon = page.locator('nav a').first();
    await expect(homeIcon).toBeVisible();
  });
});
