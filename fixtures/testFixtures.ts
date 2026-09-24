import { test as base, expect, Page, APIRequestContext, request as pwRequest } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { HomePage } from '../src/pages/home.page';
import { FindPatientPage } from '../src/pages/find-patient.page';
import { FindPatientRecordPage } from '../src/pages/find-patient-record.page';
import { RegisterPatientPage } from '../src/pages/register-patient.page';
import { PatientDashboardPage } from '../src/pages/patient-dashboard.page';
import { CaptureVitalsPage } from '../src/pages/capture-vitals.page';
import { VisitPage } from '../src/pages/visit.page';
import { AdminPage } from '../src/pages/admin.page';
import { ManageLocationsPage } from '../src/pages/manage-locations.page';
import { ManageUsersPage } from '../src/pages/manage-users.page';
import { ConfigureMetadataPage } from '../src/pages/configure-metadata.page';
import { SystemAdministrationPage } from '../src/pages/system-administration.page';
import { AppointmentSchedulingPage } from '../src/pages/appointment-scheduling.page';
import { DataManagementPage } from '../src/pages/data-management.page';
import { MergePatientsPage } from '../src/pages/merge-patients.page';
import { ActiveVisitsPage } from '../src/pages/active-visits.page';
import { env } from '../src/config/env.config';
import {
  politeDelay,
  isO2Available,
  o2UnavailableReason,
  cloudflareCookies,
  hasCloudflareBypass,
  isBrokenPage,
} from '../src/utils/helpers';

/**
 * Custom Playwright fixtures for the OpenMRS test suite.
 *
 * The O2 demo is shared with the rest of the internet. To stay friendly
 * we run workers=1 (see playwright.config) and add a small per-test delay.
 *
 * When the global-setup probe determines O2 is unreachable (Cloudflare
 * 403, network timeout, etc.), every spec self-skips cleanly instead
 * of failing — the Test Explorer shows skipped tests rather than red
 * failures, which makes the suite much easier to iterate on.
 */
async function loginAsAdmin(page: Page): Promise<void> {
  const login = new LoginPage(page);
  // Retry the login flow — Docker OpenMRS occasionally returns 502/504
  // when several workers hit it simultaneously.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await login.loginAsAdmin(env.o2.location);
      return;
    } catch (err) {
      lastError = err;
      if (attempt < 2) {
        await politeDelay(200 * (attempt + 1));
      }
    }
  }
  throw lastError;
}

/**
 * Module-level cache of the authenticated browser context.
 *
 * Each Playwright worker process gets its own cache. Reusing the context
 * means we pay the login cost (network round-trip + DOM parse) ONCE per
 * worker instead of once per test. Cuts the full UI suite from ~10 min
 * to ~3-4 min when running locally.
 *
 * Cache is keyed by baseURL so switching targets invalidates correctly.
 */
let cachedContext: import('@playwright/test').BrowserContext | undefined;
let cachedContextBaseUrl: string | undefined;

async function getOrCreateAuthedContext(
  browser: import('@playwright/test').Browser,
  baseURL: string,
): Promise<import('@playwright/test').BrowserContext> {
  if (cachedContext && cachedContextBaseUrl === baseURL) {
    return cachedContext;
  }
  if (cachedContext) {
    await cachedContext.close().catch(() => undefined);
  }
  const ctx = await browser.newContext({ baseURL });
  const page = await ctx.newPage();
  await loginAsAdmin(page);
  await page.close();
  cachedContext = ctx;
  cachedContextBaseUrl = baseURL;
  return ctx;
}

/**
 * Auto-registered beforeEach: injects the Cloudflare clearance cookie
 * into the page's browser context so tests bypass the JS challenge.
 *
 * Set `CF_CLEARANCE` in `.env` (copy from your real browser's cookies).
 * When unset, tests still run but will hit the 403 challenge — useful
 * for verifying the cookie bypass actually works.
 */
function injectCloudflareCookieOnEveryPage(): void {
  test.beforeEach(async ({ page, context }) => {
    if (!hasCloudflareBypass()) return;
    const host = new URL(env.o2.baseUrl).hostname;
    await context.addCookies(cloudflareCookies(host));
  });
}

export type OpenMrsFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  authedPage: Page;
  findPatientPage: FindPatientPage;
  findPatientRecordPage: FindPatientRecordPage;
  registerPatientPage: RegisterPatientPage;
  patientDashboardPage: PatientDashboardPage;
  captureVitalsPage: CaptureVitalsPage;
  visitPage: VisitPage;
  adminPage: AdminPage;
  manageLocationsPage: ManageLocationsPage;
  manageUsersPage: ManageUsersPage;
  configureMetadataPage: ConfigureMetadataPage;
  systemAdministrationPage: SystemAdministrationPage;
  appointmentSchedulingPage: AppointmentSchedulingPage;
  dataManagementPage: DataManagementPage;
  mergePatientsPage: MergePatientsPage;
  activeVisitsPage: ActiveVisitsPage;
  apiContext: APIRequestContext;
};

export const test = base.extend<OpenMrsFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ browser }, use) => {
    const ctx = await getOrCreateAuthedContext(browser, env.o2.baseUrl);
    const page = await ctx.newPage();
    try {
      const home = new HomePage(page);
      // O2 lands on legacy /index.htm after login. Navigate to the O2
      // Reference Application home page which has the app-tile grid.
      await page.goto(`${env.o2.baseUrl}/referenceapplication/home.page`).catch(() => undefined);
      await home.waitForReady();
      await use(home);
    } finally {
      await page.close().catch(() => undefined);
    }
  },

  authedPage: async ({ browser }, use) => {
    const ctx = await getOrCreateAuthedContext(browser, env.o2.baseUrl);
    const page = await ctx.newPage();
    try {
      await use(page);
    } finally {
      await page.close().catch(() => undefined);
    }
  },

  findPatientPage: async ({ authedPage }, use, testInfo) => {
    const find = new FindPatientPage(authedPage);
    await find.open();
    await use(find);
  },

  findPatientRecordPage: async ({ authedPage }, use) => {
    const find = new FindPatientRecordPage(authedPage);
    await find.open();
    await use(find);
  },

  registerPatientPage: async ({ authedPage }, use) => {
    const reg = new RegisterPatientPage(authedPage);
    await reg.open();
    await use(reg);
  },

  patientDashboardPage: async ({ authedPage }, use) => {
    const dash = new PatientDashboardPage(authedPage);
    await use(dash);
  },

  captureVitalsPage: async ({ authedPage }, use) => {
    const vitals = new CaptureVitalsPage(authedPage);
    await vitals.open();
    await use(vitals);
  },

  visitPage: async ({ authedPage }, use) => {
    const visit = new VisitPage(authedPage);
    await use(visit);
  },

  adminPage: async ({ authedPage }, use) => {
    const admin = new AdminPage(authedPage);
    await admin.open();
    await use(admin);
  },

  manageLocationsPage: async ({ authedPage }, use) => {
    const m = new ManageLocationsPage(authedPage);
    await m.open();
    await use(m);
  },

  manageUsersPage: async ({ authedPage }, use) => {
    const m = new ManageUsersPage(authedPage);
    await m.open();
    await use(m);
  },

  configureMetadataPage: async ({ authedPage }, use) => {
    const m = new ConfigureMetadataPage(authedPage);
    await m.open();
    await use(m);
  },

  systemAdministrationPage: async ({ authedPage }, use) => {
    const m = new SystemAdministrationPage(authedPage);
    await m.open();
    await use(m);
  },

  appointmentSchedulingPage: async ({ authedPage }, use) => {
    const m = new AppointmentSchedulingPage(authedPage);
    await m.open();
    await use(m);
  },

  dataManagementPage: async ({ authedPage }, use) => {
    const m = new DataManagementPage(authedPage);
    await m.open();
    await use(m);
  },

  mergePatientsPage: async ({ authedPage }, use) => {
    const m = new MergePatientsPage(authedPage);
    await m.open();
    await use(m);
  },

  activeVisitsPage: async ({ authedPage }, use) => {
    const m = new ActiveVisitsPage(authedPage);
    await m.open();
    await use(m);
  },

  apiContext: async ({}, use) => {
    const headers: Record<string, string> = {
      Authorization: 'Basic ' + Buffer.from(`${env.o2.username}:${env.o2.password}`).toString('base64'),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    // If the user copied cf_clearance from their browser, forward it as a
    // Cookie header on every API request so /ws/rest/v1 isn't 403-blocked.
    if (hasCloudflareBypass()) {
      const host = new URL(env.api.baseUrl).hostname;
      const cookies = cloudflareCookies(host);
      if (cookies.length > 0) {
        headers['Cookie'] = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
      }
    }

    const ctx = await pwRequest.newContext({
      baseURL: env.api.baseUrl,
      extraHTTPHeaders: headers,
    });
    await use(ctx);
    await ctx.dispose();
  },
});

// Register the Cloudflare cookie injection on the extended `test` object.
// Done at module load time so it applies to every spec that imports this fixture.
injectCloudflareCookieOnEveryPage();

export { expect };
