import { Page, Locator } from '@playwright/test';
import { env } from '../config/env.config';

/**
 * BasePage - shared behaviour for every OpenMRS Page Object.
 *
 * Provides navigation helpers, the global header, the location banner,
 * and the small set of locators that exist on every authenticated page
 * (apps menu, user menu, breadcrumbs).
 */
export class BasePage {
  /** Canonical base URL for the O2 demo. */
  static readonly BASE_URL = env.o2.baseUrl;

  readonly page: Page;

  // Global header (post-login)
  readonly openmrsLogo: Locator;
  readonly appsMenuButton: Locator;
  readonly userMenuButton: Locator;
  readonly locationBanner: Locator;
  readonly breadcrumb: Locator;
  readonly headerUserLink: Locator;

  // Pre-login page elements
  // Not readonly: LoginPage constructor reassigns them with the O2-accurate
  // selectors (`<input id="loginButton">` etc).
  loginButton: Locator;
  usernameInput: Locator;
  passwordInput: Locator;
  locationSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.openmrsLogo = page.locator('a.navbar-brand, .logo a, .brand').first();
    this.appsMenuButton = page.locator('a[id="apps-menu"], #apps-menu, .apps').first();
    this.userMenuButton = page.locator('a#user-menu, #user-menu, li:has-text("admin"), a:has-text("admin"), button:has-text("admin"), .user').first();
    this.locationBanner = page.locator('.location-banner, .current-location, #session-location').first();
    this.breadcrumb = page.locator('.breadcrumb, nav.breadcrumb').first();
    this.headerUserLink = page.locator('.user-name, .username, .user').first();

    // Login page elements
    // O2 uses `<input id="loginButton" type="submit" value="Log In">` for the
    // submit button and `<ul id="sessionLocation">` with clickable `<li>`
    // items for the location picker (NOT a <select>).
    this.usernameInput = page.locator('input#username, input[name="username"], input[placeholder="Enter your username"]');
    this.passwordInput = page.locator('input#password, input[name="password"], input[type="password"], input[placeholder="Enter your password"]');
    this.locationSelect = page.locator('#sessionLocation li, ul#sessionLocation li, ul.locations li, select#sessionLocation, select#location');
    this.loginButton = page.locator('input#loginButton, input[value="Log In"], input#submit, button[type="submit"]');
  }

  /**
   * Navigate to a path relative to the base URL. Returns the response so
   * tests can assert on status (e.g. 200/302).
   */
  async goto(path = ''): Promise<void> {
    const cleaned = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(`${BasePage.BASE_URL}${cleaned}`);
  }

  /** Get the <title> tag value. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /** Convenience to assert we landed on the login page. */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('login.htm');
  }

  /** Open the location dropdown if present. */
  async openAppsMenu(): Promise<void> {
    if (await this.appsMenuButton.isVisible().catch(() => false)) {
      await this.appsMenuButton.click();
    }
  }

  /** True when the header shows a user menu. */
  async isAuthenticated(): Promise<boolean> {
    return await this.userMenuButton.isVisible().catch(() => false);
  }
}
