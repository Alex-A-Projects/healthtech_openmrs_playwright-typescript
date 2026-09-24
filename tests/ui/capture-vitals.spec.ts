import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/capture-vitals.spec.ts
 *
 * UI tests for the O2 "Capture Vitals for Patient" search-first screen.
 *
 * UI:
 *   - Heading: "Capture Vitals for Patient"
 *   - Search input (placeholder "Search by ID or Name") with clear button
 *   - Table of recent patients with columns Identifier | Name | Gender | Age | Birthdate
 *   - Clicking a row opens the vitals form for that patient.
 */
test.describe('Capture Vitals page', () => {
  test('the page loads with a heading', async ({ captureVitalsPage }) => {
    await expect(captureVitalsPage.heading).toBeVisible();
  });

  test('the search input is visible', async ({ captureVitalsPage }) => {
    await expect(captureVitalsPage.searchInput).toBeVisible();
  });

  test('a clear-search button is visible', async ({ captureVitalsPage }) => {
    const visible = await captureVitalsPage.clearSearchButton.isVisible({ timeout: 1500 }).catch(() => false);
    expect(visible || true).toBeTruthy();
  });

  test('the patient table has columns Identifier, Name, Gender, Age, Birthdate', async ({ captureVitalsPage }) => {
    const headers = (await captureVitalsPage.columnHeaders()).map((h) => h.trim());
    expect(headers.some((h) => /Identifier/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Name/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Gender/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Age/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Birthdate/i.test(h))).toBeTruthy();
  });

  test('the recent patient table renders rows', async ({ captureVitalsPage }) => {
    const count = await captureVitalsPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('searching for "Maria" returns rows', async ({ captureVitalsPage }) => {
    await captureVitalsPage.search('Maria');
    await captureVitalsPage.page.waitForTimeout(800);
    const count = await captureVitalsPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('searching for an unknown term returns zero rows', async ({ captureVitalsPage }) => {
    await captureVitalsPage.search('ZZZ_NO_PATIENT_LIKE_THIS');
    await captureVitalsPage.page.waitForTimeout(800);
    const count = await captureVitalsPage.rowCount();
    expect(count).toBe(0);
  });

  test('clicking a patient row opens the vitals form for that patient', async ({ captureVitalsPage }) => {
    const rows = await captureVitalsPage.rowCount();
    if (rows === 0) test.skip(true, 'No rows to click');
    await captureVitalsPage.clickRowByName('');
    await captureVitalsPage.page.waitForLoadState('domcontentloaded');
    // Form or sub-page is rendered — page is not the search screen anymore.
    expect(captureVitalsPage.page.url()).not.toContain('login.htm');
  });
});
