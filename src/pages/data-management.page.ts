import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { isBrokenPage } from '../utils/helpers';

/**
 * DataManagementPage - O2 "Data Management" landing tile screen.
 *
 * Hosts: Merge Patient Electronic Records.
 */
export class DataManagementPage extends BasePage {
  readonly heading: Locator;
  readonly mergePatientElectronicRecordsCard: Locator;
  readonly mergePatientElectronicRecordsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Data Management"), h2:has-text("Data Management")').first();
    this.mergePatientElectronicRecordsCard = page
      .locator('a:has-text("Merge Patient Electronic Records"), [role="button"]:has-text("Merge Patient Electronic Records")')
      .first();
    this.mergePatientElectronicRecordsLink = page
      .locator('a:has-text("Merge Patient Electronic Records")')
      .first();
  }

  async open(): Promise<boolean> {
    await this.goto('datamanagement/home.page');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  /** Returns true when the page rendered its expected content. */
  async waitForReady(): Promise<boolean> {
    if (await this.page.locator('h1:has-text("UI Framework Error")').first().isVisible({ timeout: 500 }).catch(() => false)) {
      return false;
    }
    return await this.heading.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async clickMergePatientElectronicRecords(): Promise<void> {
    await this.mergePatientElectronicRecordsCard.click();
  }
}
