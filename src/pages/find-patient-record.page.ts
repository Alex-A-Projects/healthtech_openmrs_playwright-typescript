import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * FindPatientRecordPage - O2 "Find Patient Record" search.
 *
 * UI from screenshot:
 *   - Heading: Find Patient Record
 *   - Search input with placeholder "Search by ID or Name" + clear (x) button
 *   - Table with columns: Identifier | Name | Gender | Age | Birthdate
 *   - Identifier column shows "101xxx" with a green "Recent" badge
 */
export class FindPatientRecordPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly recentBadge: Locator;

  readonly table: Locator;
  readonly rows: Locator;
  readonly identifierColumn: Locator;
  readonly nameColumn: Locator;
  readonly genderColumn: Locator;
  readonly ageColumn: Locator;
  readonly birthdateColumn: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Find Patient Record"), h2:has-text("Find Patient Record")').first();
    this.searchInput = page.locator('input[placeholder*="Search by ID or Name"]').first();
    this.clearSearchButton = page.locator('button[aria-label*="clear" i], button[aria-label*="close" i], button:has-text("✕")').first();
    this.recentBadge = page.locator(':text("Recent")').first();

    this.table = page.locator('table').first();
    this.rows = page.locator('table tbody tr');
    this.identifierColumn = page.locator('thead th:has-text("Identifier"), tbody td:first-child').first();
    this.nameColumn = page.locator('thead th:has-text("Name")').first();
    this.genderColumn = page.locator('thead th:has-text("Gender")').first();
    this.ageColumn = page.locator('thead th:has-text("Age")').first();
    this.birthdateColumn = page.locator('thead th:has-text("Birthdate")').first();
  }

  async open(): Promise<boolean> {
    // Legacy O2 URL — works on both O2 demo and Docker image.
    await this.goto('coreapps/findpatient/findPatient.page');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await politeDelay();
  }

  async clearSearch(): Promise<void> {
    if (await this.clearSearchButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.clearSearchButton.click();
    } else {
      await this.searchInput.fill('');
    }
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async clickRowByName(name: string): Promise<void> {
    const row = this.rows.filter({ hasText: name }).first();
    await row.locator('a, button').first().click();
  }

  async clickRowByIdentifier(id: string): Promise<void> {
    const row = this.rows.filter({ hasText: id }).first();
    await row.locator('a, button').first().click();
  }

  async columnHeaders(): Promise<string[]> {
    return await this.page.locator('thead th').allTextContents();
  }

  async hasRecentBadge(): Promise<boolean> {
    return await this.recentBadge.first().isVisible({ timeout: 1500 }).catch(() => false);
  }
}
