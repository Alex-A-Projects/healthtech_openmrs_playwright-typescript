import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { politeDelay } from '../utils/helpers';

/**
 * VisitPage - the "Start Visit" form / dialog.
 */
export class VisitPage extends BasePage {
  readonly visitTypeSelect: Locator;
  readonly startDatetimeInput: Locator;
  readonly stopDatetimeInput: Locator;
  readonly locationSelect: Locator;
  readonly startButton: Locator;
  readonly cancelButton: Locator;
  readonly dialog: Locator;

  constructor(page: Page) {
    super(page);
    this.dialog = page.locator('.simple-dialog, .modal, .dialog, .visit-dialog').first();
    this.visitTypeSelect = page.locator('select#visitType, select[name*="visitType"], select[name*="type"]').first();
    this.startDatetimeInput = page.locator('input#startDatetime, input[name*="startDatetime"], input[type="datetime-local"]').first();
    this.stopDatetimeInput = page.locator('input#stopDatetime, input[name*="stopDatetime"]').first();
    this.locationSelect = page.locator('select#location, select[name*="location"]').first();
    this.startButton = page.locator('button:has-text("Start Visit"), button:has-text("Save"), button[type="submit"]').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
  }

  async startVisit(type = 'Clinic or Hospital Visit', location?: string): Promise<void> {
    if (await this.dialog.isVisible().catch(() => false)) {
      await this.visitTypeSelect.selectOption({ label: type }).catch(async () => {
        await this.visitTypeSelect.selectOption({ value: type });
      });
      if (location && (await this.locationSelect.count()) > 0) {
        await this.locationSelect.selectOption({ label: location }).catch(async () => {
          await this.locationSelect.selectOption({ value: location });
        });
      }
      await politeDelay();
      await this.startButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /** True when the visit dialog is currently visible. */
  async isDialogVisible(): Promise<boolean> {
    return await this.dialog.isVisible().catch(() => false);
  }
}
