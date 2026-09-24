import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { isBrokenPage } from '../utils/helpers';

/**
 * AdminPage - the system administration section (adminui).
 */
export class AdminPage extends BasePage {
  readonly locationsLink: Locator;
  readonly manageLocationsLink: Locator;
  readonly manageUsersLink: Locator;
  readonly manageRolesLink: Locator;
  readonly manageConceptsLink: Locator;
  readonly pageBody: Locator;
  readonly headerTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.locationsLink = page.locator('a:has-text("Locations")').first();
    this.manageLocationsLink = page.locator('a:has-text("Manage Locations"), a:has-text("Locations")').first();
    this.manageUsersLink = page.locator('a:has-text("Manage Users"), a:has-text("Users")').first();
    this.manageRolesLink = page.locator('a:has-text("Manage Roles"), a:has-text("Roles")').first();
    this.manageConceptsLink = page.locator('a:has-text("Manage Concepts"), a:has-text("Concepts")').first();
    this.pageBody = page.locator('body');
    this.headerTitle = page.locator('h1, h2, .page-title').first();
  }

  async open(): Promise<boolean> {
    await this.goto('adminui/systemadministration/systemAdministration.page');
    if (await this.headerTitle.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  async goToLocations(): Promise<void> {
    await this.manageLocationsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToUsers(): Promise<void> {
    await this.manageUsersLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToRoles(): Promise<void> {
    await this.manageRolesLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPageTitle(): Promise<string> {
    return ((await this.headerTitle.textContent()) ?? '').trim();
  }
}
