import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { env } from '../config/env.config';
import { politeDelay } from '../utils/helpers';
import { O2_LOCATIONS } from '../constants';

/**
 * LoginPage - the O2 login screen (login.htm).
 *
 * Layout (matches the actual O2 login page):
 *   - Banner with link to /referenceapplication/home.page
 *   - "Login" group containing:
 *       - Username textbox (placeholder: "Enter your username")
 *       - Password textbox (placeholder: "Enter your password")
 *       - "Location for this session:" label + clickable list of locations
 *         (NOT a <select> — these are <li> items you click to select)
 *       - "Log In" submit button (a <button>, not an <input type="submit">)
 *   - Footer with "Reference Application" version
 */
export class LoginPage extends BasePage {
  /** The login <section>/<form> wrapper. */
  readonly loginForm: Locator;
  readonly loginError: Locator;

  /** Clickable location items (rendered as a list, not a <select>). */
  readonly locationList: Locator;
  readonly locationListItems: Locator;

  constructor(page: Page) {
    super(page);
    // Overrides from BasePage — keep these in sync with the actual O2 selectors.
    this.usernameInput = page.locator('input[name="username"], input#username, input[placeholder="Enter your username"]').first();
    this.passwordInput = page.locator('input[name="password"], input#password, input[placeholder="Enter your password"]').first();
    // On O2, location is `<ul id="sessionLocation">` with clickable `<li>`
    // items. There is NO <select> element on the actual login page.
    this.locationSelect = page.locator('#sessionLocation li, ul#sessionLocation li, ul.locations li').first();
    // Submit is `<input id="loginButton" type="submit" value="Log In">`.
    this.loginButton = page.locator('input#loginButton, input[value="Log In"], button:has-text("Log In")').first();

    this.loginForm = page.locator('form, [role="form"], section').first();
    this.loginError = page.locator('#error-message, .field-error, .login-error, .error, [role="alert"]').first();

    this.locationList = page.locator('#sessionLocation, ul.locations, .location-list').first();
    this.locationListItems = page.locator('#sessionLocation li, ul.locations li, .location-list li');
  }

  /** Open the login page. */
  async open(): Promise<void> {
    await this.goto('login.htm');
    await expect(this.usernameInput).toBeVisible();
  }

  /** Click a location by display name (handles list-style pickers). */
  async selectLocation(location: string): Promise<void> {
    // Prefer the clickable-list approach (O2 UI). Falls back to <select> only
    // if no list items exist (defensive — older skins or test fixtures).
    const listItem = this.locationListItems.filter({ hasText: location }).first();
    if ((await listItem.count()) > 0) {
      await listItem.click();
    } else {
      try {
        await this.locationSelect.selectOption({ label: location });
      } catch {
        await this.locationSelect.selectOption({ value: location });
      }
    }
    await politeDelay();
  }

  /** Convenience: log in with the default O2 admin credentials. */
  async loginAsAdmin(location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.fill(env.o2.username);
    await this.passwordInput.fill(env.o2.password);
    await this.loginButton.click();
  }

  /** Log in with arbitrary credentials. */
  async login(username: string, password: string, location: string = env.o2.location): Promise<void> {
    await this.open();
    await this.selectLocation(location);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Read the visible error text after a failed login. */
  async getErrorMessage(): Promise<string> {
    const err = this.loginError.first();
    if (await err.isVisible().catch(() => false)) {
      return ((await err.textContent()) ?? '').trim();
    }
    return '';
  }

  /**
   * Return the currently-selected location. O2 stores the selected
   * location in a hidden `<input id="sessionLocationInput">` whose value
   * matches the `<li value="...">` attribute, and applies `.selected` to
   * the active `<li>`. This helper normalizes both.
   */
  async getSelectedLocation(): Promise<string | null> {
    // Hidden input is the source of truth
    const hidden = this.page.locator('#sessionLocationInput').first();
    if (await hidden.count() > 0) {
      const v = await hidden.inputValue().catch(() => '');
      if (v) return v;
    }
    // Fallback: which <li> has the .selected class?
    const selectedLi = this.locationListItems.filter({ has: this.page.locator('.selected') }).first();
    if (await selectedLi.count() > 0) {
      return ((await selectedLi.textContent()) ?? '').trim();
    }
    return null;
  }

  /** Returns the option labels available in the location picker. */
  async listAvailableLocations(): Promise<string[]> {
    // Try the list-style picker first, fall back to <select><option>.
    const listCount = await this.locationListItems.count();
    if (listCount > 0) {
      return (await this.locationListItems.allTextContents()).map((s) => s.trim()).filter(Boolean);
    }
    return await this.locationSelect.locator('option').allTextContents();
  }

  /** Verify all common O2 locations are present. */
  async hasExpectedLocations(): Promise<boolean> {
    const available = await this.listAvailableLocations();
    return O2_LOCATIONS.some((loc) => available.some((a) => a.includes(loc)));
  }

  /** Form-level validation: try submitting empty fields. */
  async submitEmpty(): Promise<void> {
    await this.open();
    await this.loginButton.click();
  }

  /** Form-level validation: only username provided. */
  async submitUsernameOnly(username: string): Promise<void> {
    await this.open();
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  /** Form-level validation: only password provided. */
  async submitPasswordOnly(password: string): Promise<void> {
    await this.open();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** True when the URL is the login page (after a logout, for example). */
  async isVisible(): Promise<boolean> {
    return await this.page
      .locator('input[name="username"], input#username')
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);
  }
}
