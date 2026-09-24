import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../src/config/env.config';
import { cloudflareCookies, hasCloudflareBypass } from '../../src/utils/helpers';

/**
 * tests/api/cloudflare-bypass.spec.ts
 *
 * Verifies the Cloudflare cookie-injection mechanism is wired correctly.
 * When CF_CLEARANCE is set in .env, every API request should carry it as
 * a Cookie header so O2 lets the test straight through without the JS
 * challenge.
 */
test.describe('Cloudflare bypass', () => {
  test('hasCloudflareBypass returns true when CF_CLEARANCE is configured', () => {
    if (!env.cfClearance) {
      test.skip(true, 'CF_CLEARANCE not set — bypass is inactive for this run.');
    }
    expect(hasCloudflareBypass()).toBeTruthy();
  });

  test('cloudflareCookies builds a cookie array targeting the O2 host', () => {
    if (!env.cfClearance) test.skip(true, 'CF_CLEARANCE not set');
    const host = new URL(env.o2.baseUrl).hostname;
    const cookies = cloudflareCookies(host);
    expect(cookies.length).toBeGreaterThanOrEqual(1);
    expect(cookies[0].name).toBe('cf_clearance');
    expect(cookies[0].value).toBe(env.cfClearance);
    expect(cookies[0].domain).toBe(host);
    expect(cookies[0].secure).toBeTruthy();
    expect(cookies[0].httpOnly).toBeTruthy();
  });

  test('cloudflareCookies returns empty array when no clearance is configured', () => {
    if (env.cfClearance) test.skip(true, 'CF_CLEARANCE is set — clear it to run this test');
    const cookies = cloudflareCookies('o2.openmrs.org');
    expect(cookies).toEqual([]);
  });

  test('the apiContext reaches O2 successfully when bypass is configured', async ({ apiContext }) => {
    if (!env.cfClearance) test.skip(true, 'CF_CLEARANCE not set');
    // If CF_CLEARANCE is set, O2 should answer without a 403.
    const res = await apiContext.get('session');
    expect(res.status()).toBeLessThan(400);
    const body = await res.json().catch(() => ({}));
    expect(body.authenticated).toBe(true);
  });
});
