import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * FindPatientPage - the patient search screen (findPatient.htm).
 *
 * The search box matches on name fragments, identifier, and UUID. Results
 * appear as a list of cards/rows linking to the patient's dashboard.
 */
export class FindPatientPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsTable: Locator;
  readonly resultsRows: Locator;
  readonly noResultsMessage: Locator;
  readonly createNewPatientLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input#patient-search, input[name="value"], input[placeholder*="Search"], input[placeholder=" "]');
    this.searchButton = page.locator('button#search-button, #patient-search-submit, input[type="submit"][value*="Search"]').first();
    this.resultsTable = page.locator('table.results, .patient-results, #patient-search-results-table').first();
    this.resultsRows = page.locator('table.results tbody tr, .patient-results tr, #patient-search-results-table tbody tr');
    this.noResultsMessage = page.locator('text=/no patients found|no results/i').first();
    this.createNewPatientLink = page.locator('a:has-text("Create New Patient"), a:has-text("Register a patient"), a:has-text("Add Patient")').first();
  }

  /** Open the Find Patient screen. */
  async open(): Promise<boolean> {
    await this.goto('findPatient.htm');
    if (await this.searchInput.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  /** Run a search. */
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await politeDelay();
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(800); // O2 search is server-rendered; let it settle
  }

  /** Click the Search button (alternative to pressing Enter). */
  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  /** Click a result row by patient display name. */
  async clickResultByName(displayName: string): Promise<void> {
    const row = this.resultsRows.filter({ hasText: displayName }).first();
    await row.locator('a, button').first().click();
  }

  /** True when the results table has rows. */
  async hasResults(): Promise<boolean> {
    return (await this.resultsRows.count()) > 0;
  }

  /** Number of rows in the results table. */
  async resultCount(): Promise<number> {
    return await this.resultsRows.count();
  }

  /** True when the no-results message is visible. */
  async showsNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible().catch(() => false);
  }

  /** Click "Register a patient" / "Create New Patient". */
  async clickCreateNewPatient(): Promise<void> {
    await this.createNewPatientLink.click();
  }
}
