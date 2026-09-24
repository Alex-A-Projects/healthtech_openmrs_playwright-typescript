import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { isBrokenPage } from '../utils/helpers';

/**
 * AppointmentSchedulingPage - O2 "Appointment Scheduling" landing tile screen.
 *
 * Five tile cards:
 *   Manage Service Types, Manage Provider Schedules, Manage Appointments,
 *   Daily Appointments, Appointment Requests
 */
export class AppointmentSchedulingPage extends BasePage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;
  readonly manageServiceTypesCard: Locator;
  readonly manageProviderSchedulesCard: Locator;
  readonly manageAppointmentsCard: Locator;
  readonly dailyAppointmentsCard: Locator;
  readonly appointmentRequestsCard: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Appointment Scheduling"), h2:has-text("Appointment Scheduling")').first();
    this.breadcrumb = page.locator('nav a:has-text("Appointment Scheduling"), .breadcrumb a:has-text("Appointment Scheduling")').first();

    this.manageServiceTypesCard = page.locator('a:has-text("Manage Service Types"), [role="button"]:has-text("Manage Service Types")').first();
    this.manageProviderSchedulesCard = page.locator('a:has-text("Manage Provider Schedules"), [role="button"]:has-text("Manage Provider Schedules")').first();
    this.manageAppointmentsCard = page.locator('a:has-text("Manage Appointments"), [role="button"]:has-text("Manage Appointments")').first();
    this.dailyAppointmentsCard = page.locator('a:has-text("Daily Appointments"), [role="button"]:has-text("Daily Appointments")').first();
    this.appointmentRequestsCard = page.locator('a:has-text("Appointment Requests"), [role="button"]:has-text("Appointment Requests")').first();
  }

  async open(): Promise<boolean> {
    await this.goto('appointmentschedulingui/home.page');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  /** Returns true when the page rendered its expected content. */
  async waitForReady(): Promise<boolean> {
    // Soft check: never throw — return whether the page rendered properly.
    if (await this.page.locator('h1:has-text("UI Framework Error")').first().isVisible({ timeout: 500 }).catch(() => false)) {
      return false;
    }
    const visible = await this.heading.isVisible({ timeout: 2000 }).catch(() => false);
    return visible;
  }

  async clickManageServiceTypes(): Promise<void> { await this.manageServiceTypesCard.click(); }
  async clickManageProviderSchedules(): Promise<void> { await this.manageProviderSchedulesCard.click(); }
  async clickManageAppointments(): Promise<void> { await this.manageAppointmentsCard.click(); }
  async clickDailyAppointments(): Promise<void> { await this.dailyAppointmentsCard.click(); }
  async clickAppointmentRequests(): Promise<void> { await this.appointmentRequestsCard.click(); }
}
