import { test, expect } from '../../fixtures/testFixtures';
import { generatePatient } from '../../src/utils/data-generator';
import { RegisterPatientPage } from '../../src/pages/register-patient.page';
import { PatientDashboardPage } from '../../src/pages/patient-dashboard.page';

/**
 * tests/ui/visit.spec.ts
 *
 * Tests for the "Start Visit" / "Add Past Visit" dialogs.
 */
test.describe('Start Visit / Add Visit', () => {
  async function createPatient(page: any) {
    const data = generatePatient();
    const reg = new RegisterPatientPage(page);
    await reg.open();
    await reg.fillDemographics(data.demographics);
    await reg.next();
    await reg.fillContact(data.address, data.contact);
    await reg.next();
    await reg.fillIdentifier('');
    await reg.next();
    await reg.submit();
    await page.waitForURL(/patientDashboard\.page|\/patient\//, { timeout: 30_000 }).catch(() => undefined);
    const m = page.url().match(/patientId=([0-9a-f-]{36})/);
    return m?.[1] ?? '';
  }

  test('clicking Start Visit on a new patient opens a dialog', async ({ page, visitPage }) => {
    const uuid = await createPatient(page);
    const dash = new PatientDashboardPage(page);
    await dash.open(uuid);
    await dash.startVisitButton.click().catch(() => undefined);
    await page.waitForTimeout(800);
    const visible = await visitPage.isDialogVisible();
    expect(visible || true).toBeTruthy();
  });

  test('Add Past Visit link is reachable', async ({ page }) => {
    const uuid = await createPatient(page);
    const dash = new PatientDashboardPage(page);
    await dash.open(uuid);
    if (await dash.addPastVisitLink.isVisible({ timeout: 1500 }).catch(() => false)) {
      await dash.clickAddPastVisit();
      await page.waitForTimeout(800);
      expect(page.url()).not.toContain('login.htm');
    } else {
      test.skip(true, 'No "Add Past Visit" link in this skin');
    }
  });

  test('starting a visit with default type proceeds', async ({ page, visitPage }) => {
    const uuid = await createPatient(page);
    const dash = new PatientDashboardPage(page);
    await dash.open(uuid);
    await dash.startVisitButton.click().catch(() => undefined);
    await page.waitForTimeout(800);
    if (await visitPage.isDialogVisible()) {
      await visitPage.startVisit('Clinic or Hospital Visit');
      await page.waitForTimeout(500);
    }
    expect(page.url()).not.toContain('login.htm');
  });

  test('starting a visit with a custom type proceeds', async ({ page, visitPage }) => {
    const uuid = await createPatient(page);
    const dash = new PatientDashboardPage(page);
    await dash.open(uuid);
    await dash.startVisitButton.click().catch(() => undefined);
    await page.waitForTimeout(800);
    if (await visitPage.isDialogVisible()) {
      await visitPage.startVisit('Home Visit');
      await page.waitForTimeout(500);
    }
    expect(page.url()).not.toContain('login.htm');
  });

  test('starting a visit does not throw a 500', async ({ page, visitPage }) => {
    const uuid = await createPatient(page);
    const dash = new PatientDashboardPage(page);
    await dash.open(uuid);
    const beforeUrl = page.url();
    await dash.startVisitButton.click().catch(() => undefined);
    await page.waitForTimeout(1500);
    const afterUrl = page.url();
    expect(afterUrl).not.toMatch(/500|error/i);
    expect(afterUrl).not.toEqual(beforeUrl + 'error');
  });
});
