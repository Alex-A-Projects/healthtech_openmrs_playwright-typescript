import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * CaptureVitalsPage - O2 "Capture Vitals" search-first landing.
 *
 * UI from screenshot:
 *   - Heading: "Capture Vitals for Patient"
 *   - Search input with placeholder "Search by ID or Name" + clear button
 *   - Below the search: a table of recent patients with columns:
 *     Identifier | Name | Gender | Age | Birthdate
 *   - Clicking a row opens the vitals form for that patient.
 */
export class CaptureVitalsPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;

  readonly table: Locator;
  readonly rows: Locator;
  readonly identifierColumn: Locator;
  readonly nameColumn: Locator;
  readonly genderColumn: Locator;
  readonly ageColumn: Locator;
  readonly birthdateColumn: Locator;

  // Vitals form (revealed after selecting a patient)
  readonly weightInput: Locator;
  readonly heightInput: Locator;
  readonly temperatureInput: Locator;
  readonly systolicBPInput: Locator;
  readonly diastolicBPInput: Locator;
  readonly pulseInput: Locator;
  readonly oxygenInput: Locator;
  readonly respiratoryRateInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Capture Vitals"), h2:has-text("Capture Vitals")').first();
    this.searchInput = page.locator('input[placeholder*="Search by ID or Name"]').first();
    this.clearSearchButton = page.locator('button[aria-label*="clear" i], button[aria-label*="close" i]').first();

    this.table = page.locator('table').first();
    this.rows = page.locator('table tbody tr');
    this.identifierColumn = page.locator('thead th:has-text("Identifier")').first();
    this.nameColumn = page.locator('thead th:has-text("Name")').first();
    this.genderColumn = page.locator('thead th:has-text("Gender")').first();
    this.ageColumn = page.locator('thead th:has-text("Age")').first();
    this.birthdateColumn = page.locator('thead th:has-text("Birthdate")').first();

    this.weightInput = page.locator('input#weight, input[name="weight"]').first();
    this.heightInput = page.locator('input#height, input[name="height"]').first();
    this.temperatureInput = page.locator('input#temperature, input[name="temperature"]').first();
    this.systolicBPInput = page.locator('input#systolic, input[name="systolic"]').first();
    this.diastolicBPInput = page.locator('input#diastolic, input[name="diastolic"]').first();
    this.pulseInput = page.locator('input#pulse, input[name="pulse"]').first();
    this.oxygenInput = page.locator('input#oxygenSaturation, input#oxygen, input[name="oxygen"]').first();
    this.respiratoryRateInput = page.locator('input#respiratoryRate, input[name="respiratoryRate"]').first();
    this.saveButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Save")').first();
    this.cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('vitals/patient.page?appId=referenceapp.vitals');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await politeDelay();
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async clickRowByName(name: string): Promise<void> {
    const row = this.rows.filter({ hasText: name }).first();
    await row.locator('a, button').first().click();
  }

  async columnHeaders(): Promise<string[]> {
    return await this.page.locator('thead th').allTextContents();
  }
}
