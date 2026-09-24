import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * HomePage - O2's post-login "Home" screen.
 *
 * Layout (from screenshots):
 *   - Header with OpenMRS logo, admin user, location dropdown, Logout button.
 *   - Breadcrumb: Home
 *   - A grid of app tiles:
 *       Find Patient Record, Awaiting Admission, Active Visits,
 *       Register a patient, Capture Vitals, Register a patient,
 *       Appointment Scheduling, Reports, Data Management,
 *       Configure Metadata, System Administration
 */
export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly findPatientRecordApp: Locator;
  readonly awaitingAdmissionApp: Locator;
  readonly activeVisitsApp: Locator;
  readonly registerPatientApp: Locator;
  readonly captureVitalsApp: Locator;
  readonly appointmentSchedulingApp: Locator;
  readonly reportsApp: Locator;
  readonly dataManagementApp: Locator;
  readonly configureMetadataApp: Locator;
  readonly systemAdministrationApp: Locator;
  readonly userMenu: Locator;
  readonly logoutLink: Locator;
  readonly locationDropdown: Locator;
  readonly breadcrumbHome: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Home"), h2:has-text("Home")').first();

    this.findPatientRecordApp = page
      .locator('a:has-text("Find Patient Record"), [role="button"]:has-text("Find Patient Record")')
      .first();
    this.awaitingAdmissionApp = page
      .locator('a:has-text("Awaiting Admission"), [role="button"]:has-text("Awaiting Admission")')
      .first();
    this.activeVisitsApp = page
      .locator('a:has-text("Active Visits"), [role="button"]:has-text("Active Visits")')
      .first();
    this.registerPatientApp = page
      .locator('a:has-text("Register a patient"), [role="button"]:has-text("Register a patient")')
      .first();
    this.captureVitalsApp = page
      .locator('a:has-text("Capture Vitals"), [role="button"]:has-text("Capture Vitals")')
      .first();
    this.appointmentSchedulingApp = page
      .locator('a:has-text("Appointment Scheduling"), [role="button"]:has-text("Appointment Scheduling")')
      .first();
    this.reportsApp = page
      .locator('a:has-text("Reports"), [role="button"]:has-text("Reports")')
      .first();
    this.dataManagementApp = page
      .locator('a:has-text("Data Management"), [role="button"]:has-text("Data Management")')
      .first();
    this.configureMetadataApp = page
      .locator('a:has-text("Configure Metadata"), [role="button"]:has-text("Configure Metadata")')
      .first();
    this.systemAdministrationApp = page
      .locator('a:has-text("System Administration"), [role="button"]:has-text("System Administration")')
      .first();

    this.userMenu = page.locator('li:has-text("admin"), button:has-text("admin"), a:has-text("admin"), [aria-label*="user" i]').first();
    this.logoutLink = page.locator('a:has-text("Logout"), button:has-text("Logout")').first();
    this.locationDropdown = page.locator('button:has-text("Inpatient Ward"), select').first();
    this.breadcrumbHome = page.locator('nav a:has-text("Home"), .breadcrumb a:has-text("Home")').first();
  }

  /** Wait until the home app grid has loaded. */
  async waitForReady(): Promise<void> {
    // Wait for the O2 Reference Application home tiles to render.
    // They appear as <a> inside <main>, with text like "Find Patient Record".
    const anyTile = this.findPatientRecordApp;
    await anyTile.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
  }

  /** Open any of the app tiles by display name. */
  async openApp(appName: string): Promise<void> {
    const tile = this.page
      .locator(`a:has-text("${appName}"), [role="button"]:has-text("${appName}")`)
      .first();
    await tile.click();
  }

  async clickFindPatientRecord(): Promise<void> {
    await this.findPatientRecordApp.click();
  }
  async clickAwaitingAdmission(): Promise<void> {
    await this.awaitingAdmissionApp.click();
  }
  async clickActiveVisits(): Promise<void> {
    await this.activeVisitsApp.click();
  }
  async clickRegisterPatient(): Promise<void> {
    await this.registerPatientApp.click();
  }
  async clickCaptureVitals(): Promise<void> {
    await this.captureVitalsApp.click();
  }
  async clickAppointmentScheduling(): Promise<void> {
    await this.appointmentSchedulingApp.click();
  }
  async clickReports(): Promise<void> {
    await this.reportsApp.click();
  }
  async clickDataManagement(): Promise<void> {
    await this.dataManagementApp.click();
  }
  async clickConfigureMetadata(): Promise<void> {
    await this.configureMetadataApp.click();
  }
  async clickSystemAdministration(): Promise<void> {
    await this.systemAdministrationApp.click();
  }

  /** All visible app-tile labels. */
  async listAllAppTiles(): Promise<string[]> {
    return await this.page.locator('main a, main [role="button"]').allTextContents();
  }

  async hasUserMenu(): Promise<boolean> {
    return await this.userMenu.isVisible().catch(() => false);
  }
}
