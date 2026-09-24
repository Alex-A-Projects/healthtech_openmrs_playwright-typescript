import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * MergePatientsPage - "Merge Patient Electronic Records" form.
 *
 * UI from screenshot:
 *   "Select two patients to merge..."
 *   - Two Patient ID inputs with barcode icons
 *   - "Search by ID or Name" dynamic search below
 *   - Cancel / Continue buttons
 */
export class MergePatientsPage extends BasePage {
  readonly heading: Locator;
  readonly selectPrompt: Locator;
  readonly helpText: Locator;

  readonly firstPatientIdInput: Locator;
  readonly secondPatientIdInput: Locator;

  readonly dynamicSearchInput: Locator;
  readonly dynamicSearchLabel: Locator;

  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h2:has-text("Select two patients to merge"), h1:has-text("Select two patients to merge")').first();
    this.selectPrompt = page.locator(':text("Select two patients to merge...")').first();
    this.helpText = page.locator(':text("Please enter the Patient IDs of the two electronic records to merge.")').first();

    this.firstPatientIdInput = page.locator('input[placeholder*="Patient ID"], label:has-text("Patient ID") + input').first();
    this.secondPatientIdInput = page.locator('input[placeholder*="Patient ID"], label:has-text("Patient ID") + input').nth(1);

    this.dynamicSearchInput = page.locator('input[placeholder*="Search by ID or Name"]').first();
    this.dynamicSearchLabel = page.locator(':text("You can also dynamically search for patients to merge, by name or id")').first();

    this.cancelButton = page.locator('button:has-text("Cancel")').first();
    this.continueButton = page.locator('button:has-text("Continue")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('datamanagement/mergePatients.page');
    if (await this.selectPrompt.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  async enterFirstPatientId(id: string): Promise<void> {
    await this.firstPatientIdInput.fill(id);
    await politeDelay();
  }

  async enterSecondPatientId(id: string): Promise<void> {
    await this.secondPatientIdInput.fill(id);
    await politeDelay();
  }

  async dynamicSearch(term: string): Promise<void> {
    await this.dynamicSearchInput.fill(term);
    await politeDelay();
  }

  async clickCancel(): Promise<void> { await this.cancelButton.click(); }
  async clickContinue(): Promise<void> { await this.continueButton.click(); }

  async isContinueEnabled(): Promise<boolean> {
    return await this.continueButton.isEnabled().catch(() => false);
  }

  async isContinueDisabled(): Promise<boolean> {
    return await this.continueButton.isDisabled().catch(() => false);
  }
}
