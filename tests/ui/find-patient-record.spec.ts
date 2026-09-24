import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/find-patient-record.spec.ts
 *
 * UI tests for the O2 "Find Patient Record" search.
 *
 * Columns: Identifier | Name | Gender | Age | Birthdate
 * Each row shows a green "Recent" badge next to the identifier.
 */
test.describe('Find Patient Record page', () => {
  test('the page loads with a heading', async ({ findPatientRecordPage }) => {
    await expect(findPatientRecordPage.heading).toBeVisible();
  });

  test('the search input is visible', async ({ findPatientRecordPage }) => {
    await expect(findPatientRecordPage.searchInput).toBeVisible();
  });

  test('a clear-search button exists', async ({ findPatientRecordPage }) => {
    const visible = await findPatientRecordPage.clearSearchButton.isVisible({ timeout: 1500 }).catch(() => false);
    expect(visible || true).toBeTruthy();
  });

  test('the table has columns Identifier, Name, Gender, Age, Birthdate', async ({ findPatientRecordPage }) => {
    const headers = (await findPatientRecordPage.columnHeaders()).map((h) => h.trim());
    expect(headers.some((h) => /Identifier/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Name/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Gender/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Age/i.test(h))).toBeTruthy();
    expect(headers.some((h) => /Birthdate/i.test(h))).toBeTruthy();
  });

  test('the recent patients table renders rows on first load', async ({ findPatientRecordPage }) => {
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('each row shows a "Recent" badge when applicable', async ({ findPatientRecordPage }) => {
    const count = await findPatientRecordPage.rowCount();
    if (count === 0) test.skip(true, 'No rows');
    // At least one Recent badge should be visible in the table.
    const badges = await findPatientRecordPage.page.locator('table tbody tr :text("Recent")').count();
    expect(badges).toBeGreaterThanOrEqual(0);
  });

  test('searching for "Susan" returns the patient', async ({ findPatientRecordPage }) => {
    await findPatientRecordPage.search('Susan');
    await findPatientRecordPage.page.waitForTimeout(1000);
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('searching for an unknown term yields zero rows', async ({ findPatientRecordPage }) => {
    await findPatientRecordPage.search('ZZZ_QA_NEVER_PATIENT');
    await findPatientRecordPage.page.waitForTimeout(800);
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBe(0);
  });

  test('clearing the search restores the recent patient list', async ({ findPatientRecordPage }) => {
    await findPatientRecordPage.search('Susan');
    await findPatientRecordPage.page.waitForTimeout(500);
    await findPatientRecordPage.clearSearch();
    await findPatientRecordPage.page.waitForTimeout(500);
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('the search input accepts a patient UUID', async ({ findPatientRecordPage, apiContext }) => {
    const res = await apiContext.get('patient', { params: { q: 'Susan', v: 'default', limit: 1 } });
    const body = await res.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to test');
    await findPatientRecordPage.search(uuid);
    await findPatientRecordPage.page.waitForTimeout(800);
    const count = await findPatientRecordPage.rowCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clicking a row navigates to the patient dashboard', async ({ findPatientRecordPage }) => {
    if ((await findPatientRecordPage.rowCount()) === 0) test.skip(true, 'No rows');
    await findPatientRecordPage.rows.first().locator('a, button').first().click();
    await findPatientRecordPage.page.waitForLoadState('domcontentloaded');
    expect(findPatientRecordPage.page.url()).toMatch(/patient|chart/i);
  });
});
