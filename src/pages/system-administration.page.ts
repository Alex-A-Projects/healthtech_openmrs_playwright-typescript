import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { isBrokenPage } from '../utils/helpers';

/**
 * SystemAdministrationPage - O2 "System Administration" landing tile screen.
 *
 * Six tile cards:
 *   Manage Extensions, Manage Apps, Manage Global Properties,
 *   Manage Accounts, Style Guide, Advanced Administration
 *
 * URL pattern visible in screenshot: .../openmrs/admin/index.htm
 */
export class SystemAdministrationPage extends BasePage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;

  readonly manageExtensionsCard: Locator;
  readonly manageAppsCard: Locator;
  readonly manageGlobalPropertiesCard: Locator;
  readonly manageAccountsCard: Locator;
  readonly styleGuideCard: Locator;
  readonly advancedAdministrationCard: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("System Administration"), h2:has-text("System Administration")').first();
    this.breadcrumb = page.locator('nav a:has-text("System Administration"), .breadcrumb a:has-text("System Administration")').first();

    this.manageExtensionsCard = page.locator('a:has-text("Manage Extensions"), [role="button"]:has-text("Manage Extensions")').first();
    this.manageAppsCard = page.locator('a:has-text("Manage Apps"), [role="button"]:has-text("Manage Apps")').first();
    this.manageGlobalPropertiesCard = page.locator('a:has-text("Manage Global Properties"), [role="button"]:has-text("Manage Global Properties")').first();
    this.manageAccountsCard = page.locator('a:has-text("Manage Accounts"), [role="button"]:has-text("Manage Accounts")').first();
    this.styleGuideCard = page.locator('a:has-text("Style Guide"), [role="button"]:has-text("Style Guide")').first();
    this.advancedAdministrationCard = page.locator('a:has-text("Advanced Administration"), [role="button"]:has-text("Advanced Administration")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('adminui/systemadministration/systemAdministration.page');
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

  async clickManageExtensions(): Promise<void> { await this.manageExtensionsCard.click(); }
  async clickManageApps(): Promise<void> { await this.manageAppsCard.click(); }
  async clickManageGlobalProperties(): Promise<void> { await this.manageGlobalPropertiesCard.click(); }
  async clickManageAccounts(): Promise<void> { await this.manageAccountsCard.click(); }
  async clickStyleGuide(): Promise<void> { await this.styleGuideCard.click(); }
  async clickAdvancedAdministration(): Promise<void> { await this.advancedAdministrationCard.click(); }

  async cardCount(): Promise<number> {
    return await this.page.locator('main a, main [role="button"]').count();
  }
}
