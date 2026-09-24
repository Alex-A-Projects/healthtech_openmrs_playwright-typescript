import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/data-management.spec.ts
 *
 * UI tests for the "Data Management" landing screen.
 *
 * Visible cards:
 *   - Merge Patient Electronic Records
 */
test.describe('Data Management', () => {
  test('the Data Management page loads', async ({ dataManagementPage }) => {
    await dataManagementPage.waitForReady();
    expect(dataManagementPage.page.url()).toMatch(/datamanagement|data-management/i);
  });

  test('the heading "Data Management" is visible', async ({ dataManagementPage }) => {
    await expect(dataManagementPage.heading).toBeVisible();
  });

  test('the Merge Patient Electronic Records card is visible', async ({ dataManagementPage }) => {
    await expect(dataManagementPage.mergePatientElectronicRecordsCard).toBeVisible();
  });

  test('clicking Merge Patient Electronic Records navigates to the merge form', async ({ dataManagementPage, page }) => {
    await dataManagementPage.clickMergePatientElectronicRecords();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/merge/i);
  });
});
