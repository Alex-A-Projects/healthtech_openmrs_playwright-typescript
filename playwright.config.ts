import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration for the OpenMRS test suite.
 *
 * The O2 demo at o2.openmrs.org is shared with everyone on the internet,
 * so we run tests serially by default and add small per-test delays to
 * stay friendly to other users. Database tests are guarded by a project
 * tag (`db`) and are skipped automatically when DB env vars are missing.
 */
export default defineConfig({
  testDir: './tests',
  // Set SKIP_GLOBAL_SETUP=true to skip the O2 health probe (faster, but
  // you'll get less-clean failures when the host is down).
  globalSetup: process.env.SKIP_GLOBAL_SETUP === 'true' ? undefined : './global-setup.ts',
  testIgnore: ['**/node_modules/**', '**/.git/**'],
  // Tests can run in parallel since each fixture creates its own page context.
  // Use workers=1 only if you hit "Too many open connections" or flaky state.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  timeout: 60_000,
  expect: {
    // Shorter default — broken pages should fail fast, not hang for 15s.
    timeout: 5_000,
  },
  reportSlowTests: { max: 5, threshold: 15_000 },
  use: {
    baseURL: process.env.O2_BASE_URL ?? 'https://o2.openmrs.org/openmrs',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 8_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
