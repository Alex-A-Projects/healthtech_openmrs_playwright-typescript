import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ManageUsersPage - the list/edit view of system users.
 */
export class ManageUsersPage extends BasePage {
  readonly addUserButton: Locator;
  readonly usernameInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly genderSelect: Locator;
  readonly rolesSelect: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly usersTable: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.locator('a:has-text("Add User"), button:has-text("Add User")').first();
    this.usernameInput = page.locator('input#username, input[name*="username"]').first();
    this.firstNameInput = page.locator('input#givenName, input[name*="givenName"]').first();
    this.lastNameInput = page.locator('input#familyName, input[name*="familyName"]').first();
    this.genderSelect = page.locator('select#gender, select[name*="gender"]').first();
    this.rolesSelect = page.locator('select#roles, select[name*="role"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button:has-text("Save"), input[type="submit"][value="Save"]').first();
    this.usersTable = page.locator('table, .users-list').first();
    this.rows = page.locator('table tbody tr, .user-row');
  }

  async open(): Promise<void> {
    await this.goto('adminui/systemadministration/users.list');
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async clickAddUser(): Promise<void> {
    await this.addUserButton.click();
  }
}
