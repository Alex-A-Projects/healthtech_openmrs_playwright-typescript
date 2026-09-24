import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * ActiveVisitsPage - O2 "Active Visits" list view.
 *
 * UI from screenshot:
 *   - Heading: Active Visits
 *   - Search input on the left
 *   - Filters dropdown on the right with active "Facility Visit" chip
 *   - Table columns: Patient ID | Name | Check-In | Last Seen | Type of visit
 *   - Patient ID column shows "OpenMRS ID: 101xxx"
 *   - Name is a clickable link
 *   - Last Seen shows action and timestamp/location
 */
export class ActiveVisitsPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly filtersButton: Locator;
  readonly facilityVisitChip: Locator;
  readonly activeChipCloseButton: Locator;

  readonly table: Locator;
  readonly rows: Locator;
  readonly patientIdColumn: Locator;
  readonly nameColumn: Locator;
  readonly checkInColumn: Locator;
  readonly lastSeenColumn: Locator;
  readonly visitTypeColumn: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Active Visits"), h2:has-text("Active Visits")').first();
    this.searchInput = page.locator('input[placeholder*="Search" i]').first();
    this.filtersButton = page.locator('button:has-text("Filters")').first();
    this.facilityVisitChip = page.locator(':text("Facility Visit")').first();
    this.activeChipCloseButton = page.locator('button[aria-label*="remove" i], button[aria-label*="close" i]').first();

    this.table = page.locator('table').first();
    this.rows = page.locator('table tbody tr');
    this.patientIdColumn = page.locator('thead th:has-text("Patient ID"), tbody td:first-child').first();
    this.nameColumn = page.locator('thead th:has-text("Name")').first();
    this.checkInColumn = page.locator('thead th:has-text("Check-In")').first();
    this.lastSeenColumn = page.locator('thead th:has-text("Last Seen")').first();
    this.visitTypeColumn = page.locator('thead th:has-text("Type of visit")').first();
  }

  async open(): Promise<boolean> {
    // Legacy O2 URL — works on both O2 demo and Docker image.
    await this.goto('coreapps/activeVisits/activeVisits.page');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await politeDelay();
  }

  async clickFilters(): Promise<void> {
    await this.filtersButton.click();
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async clickFirstRow(): Promise<void> {
    await this.rows.first().locator('a').first().click();
  }

  async clickRowByName(name: string): Promise<void> {
    const row = this.rows.filter({ hasText: name }).first();
    await row.locator('a').first().click();
  }

  async removeFacilityVisitFilter(): Promise<void> {
    if (await this.activeChipCloseButton.isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.activeChipCloseButton.click();
    }
  }

  async columnHeaders(): Promise<string[]> {
    return await this.page.locator('thead th').allTextContents();
  }
}
