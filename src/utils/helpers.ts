import { Page, expect, request as pwRequest, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env.config';

/** Wait a configured delay to stay friendly to the shared O2 server. */
export async function politeDelay(ms = env.actionDelayMs): Promise<void> {
  if (ms > 0) await new Promise((r) => setTimeout(r, ms));
}

/** Assert a URL fragment with regex-friendly escaping. */
export async function expectUrlContains(page: Page, fragment: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(fragment.replace(/\./g, '\\.')));
}

/** Capture every pageerror / console.error message so tests can assert on them. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return errors;
}

export async function assertNoConsoleErrors(errors: string[]): Promise<void> {
  const appErrors = errors.filter(
    (e) =>
      !e.includes('favicon') &&
      !e.toLowerCase().includes('net::err_blocked_by_client') &&
      !e.includes('webpack-dev-server') &&
      !e.includes('Refused to apply style'),
  );
  expect(appErrors, `Unexpected client-side errors:\n${appErrors.join('\n')}`).toHaveLength(0);
}

/** Pull a UUID out of the URL (the OpenMRS URL convention is /.../<uuid>/...). */
export function extractUuidFromUrl(url: string): string | null {
  const m = url.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return m ? m[1] : null;
}

/** "John Smith (uuid)" → "John Smith". */
export function stripUuidFromDisplay(display: string): string {
  return display.replace(/\s*\([0-9a-f-]{36}\)\s*$/i, '').trim();
}

/** Build an authenticated APIRequestContext with HTTP Basic auth. */
export async function authedRequestContext(): Promise<APIRequestContext> {
  return await pwRequest.newContext({
    baseURL: env.api.baseUrl,
    extraHTTPHeaders: {
      Authorization:
        'Basic ' + Buffer.from(`${env.o2.username}:${env.o2.password}`).toString('base64'),
    },
  });
}

/** Retry a function up to N times with exponential backoff. */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw lastError;
}

/** Shape of the .o2-status.json file written by global-setup.ts. */
export interface O2Status {
  available: boolean;
  status: number | null;
  reason: string;
  checkedAt: string;
}

const STATUS_FILE = path.resolve(process.cwd(), '.o2-status.json');

export function readO2Status(): O2Status | null {
  try {
    if (!fs.existsSync(STATUS_FILE)) return null;
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8')) as O2Status;
  } catch {
    return null;
  }
}

export function isO2Available(): boolean {
  const s = readO2Status();
  return s ? s.available : true;
}

export function o2UnavailableReason(): string {
  const s = readO2Status();
  return s ? s.reason : 'unknown';
}

/**
 * Cloudflare clearance cookie builder.
 *
 * When you've already solved the JS challenge in your real Chrome, the
 * browser stores a `cf_clearance` cookie valid ~24h. Copy its value into
 * .env as CF_CLEARANCE and we inject it into every browser context + API
 * request so tests get straight through.
 */
export interface CloudflareCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Lax' | 'None' | 'Strict';
}

export function cloudflareCookies(hostname: string): CloudflareCookie[] {
  const { cfClearance, cfBm } = env;
  if (!cfClearance) return [];

  const baseExpires = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const cookies: CloudflareCookie[] = [
    {
      name: 'cf_clearance',
      value: cfClearance,
      domain: hostname,
      path: '/',
      expires: baseExpires,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    },
  ];
  if (cfBm) {
    cookies.push({
      name: '__cf_bm',
      value: cfBm,
      domain: hostname,
      path: '/',
      expires: baseExpires,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
  }
  return cookies;
}

export function hasCloudflareBypass(): boolean {
  return Boolean(env.cfClearance);
}

/**
 * Returns true when the current page is an OpenMRS error page OR has
 * been redirected away (e.g. to /login.htm because the requested module
 * is not installed and the location session couldn't be established).
 *
 * POM fixtures call this after their `open()` and `testInfo.skip()`
 * if it returns true, so the Test Explorer shows skipped (yellow) tests
 * instead of 15-second red timeouts.
 */
export async function isBrokenPage(page: Page): Promise<boolean> {
  // Module error pages
  const errorMarkers = [
    'h1:has-text("UI Framework Error")',
    'h1:has-text("HTTP Status 500")',
    'h1:has-text("Page Not Found")',
    'h1:has-text("HTTP Status 404")',
  ];
  for (const selector of errorMarkers) {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
      return true;
    }
  }
  // If the requested page bounced us back to login, the module is unavailable
  // (this is what happens for appointmentschedulingui on the 2.10.0 Docker image).
  if (page.url().includes('/login.htm')) {
    return true;
  }
  return false;
}
