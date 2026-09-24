import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ManageLocationsPage - the list/edit view of all locations.
 */
export class ManageLocationsPage extends BasePage {
  readonly addLocationButton: Locator;
  readonly locationNameInput: Locator;
  readonly locationDescriptionInput: Locator;
  readonly saveButton: Locator;
  readonly locationsTable: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.addLocationButton = page.locator('a:has-text("Add Location"), button:has-text("Add Location")').first();
    this.locationNameInput = page.locator('input#name, input[name*="name"]').first();
    this.locationDescriptionInput = page.locator('input#description, textarea#description, input[name*="description"]').first();
    this.saveButton = page.locator('button:has-text("Save"), input[type="submit"][value="Save"]').first();
    this.locationsTable = page.locator('table, .locations-list').first();
    this.rows = page.locator('table tbody tr, .location-row');
  }

  async open(): Promise<void> {
    await this.goto('adminui/systemadministration/location.list');
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async clickAddLocation(): Promise<void> {
    await this.addLocationButton.click();
  }

  async fillLocation(name: string, description = ''): Promise<void> {
    await this.locationNameInput.fill(name);
    if (description && (await this.locationDescriptionInput.count()) > 0) {
      await this.locationDescriptionInput.fill(description);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}
