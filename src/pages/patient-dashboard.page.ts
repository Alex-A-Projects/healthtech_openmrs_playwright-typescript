import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * PatientDashboardPage - the per-patient landing page (patientDashboard.page).
 *
 * Shows demographics, recent visits, vitals, and provides shortcuts into
 * Visit Note, Capture Vitals, Add Past Visit, etc.
 */
export class PatientDashboardPage extends BasePage {
  readonly patientHeader: Locator;
  readonly patientName: Locator;
  readonly patientIdentifier: Locator;
  readonly patientAge: Locator;
  readonly patientGender: Locator;
  readonly recentVisitsTable: Locator;
  readonly startVisitButton: Locator;
  readonly captureVitalsLink: Locator;
  readonly addPastVisitLink: Locator;
  readonly visitNoteLink: Locator;
  readonly relationshipLink: Locator;
  readonly allergiesLink: Locator;
  readonly programEnrollmentLink: Locator;
  readonly recentObservations: Locator;
  readonly actionsMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.patientHeader = page.locator('.patient-header, .patient-info, h1, h2').first();
    this.patientName = page.locator('.patient-name, .demographics-name, .givenName').first();
    this.patientIdentifier = page.locator('.patient-identifier, .identifiers').first();
    this.patientAge = page.locator('.patient-age, .age').first();
    this.patientGender = page.locator('.patient-gender, .gender').first();
    this.recentVisitsTable = page.locator('.visits .visit-list, table.visits, .recent-visits').first();
    this.startVisitButton = page.locator('a:has-text("Start Visit"), button:has-text("Start Visit")').first();
    this.captureVitalsLink = page.locator('a:has-text("Capture Vitals"), a:has-text("Vitals")').first();
    this.addPastVisitLink = page.locator('a:has-text("Add Past Visit"), a:has-text("Past Visit")').first();
    this.visitNoteLink = page.locator('a:has-text("Visit Note")').first();
    this.relationshipLink = page.locator('a:has-text("Relationships")').first();
    this.allergiesLink = page.locator('a:has-text("Allergies")').first();
    this.programEnrollmentLink = page.locator('a:has-text("Programs")').first();
    this.recentObservations = page.locator('.observations, .obs-list, .vitals-panel').first();
    this.actionsMenu = page.locator('.actions-menu, ul.nav-actions, .patient-actions').first();
  }

  /** Open the dashboard for a given patient UUID. */
  async open(uuid: string): Promise<void> {
    await this.goto(`coreapps/clinicianfacing/patient.page?patientId=${uuid}`);
  }

  /** Click "Start Visit". */
  async startVisit(): Promise<void> {
    await this.startVisitButton.click();
  }

  /** Click "Capture Vitals". */
  async clickCaptureVitals(): Promise<void> {
    await this.captureVitalsLink.click();
  }

  /** Click "Add Past Visit". */
  async clickAddPastVisit(): Promise<void> {
    await this.addPastVisitLink.click();
  }

  /** Click "Visit Note". */
  async clickVisitNote(): Promise<void> {
    await this.visitNoteLink.click();
  }

  /** True when the patient header is visible. */
  async isLoaded(): Promise<boolean> {
    return await this.patientHeader.isVisible().catch(() => false);
  }

  /** Read the patient name from the header. */
  async getPatientName(): Promise<string> {
    return ((await this.patientName.textContent()) ?? '').trim();
  }

  /** Read the displayed identifier. */
  async getIdentifier(): Promise<string> {
    return ((await this.patientIdentifier.textContent()) ?? '').trim();
  }

  /** Read the displayed age. */
  async getAge(): Promise<string> {
    return ((await this.patientAge.textContent()) ?? '').trim();
  }

  /** Read the displayed gender. */
  async getGender(): Promise<string> {
    return ((await this.patientGender.textContent()) ?? '').trim();
  }
}
