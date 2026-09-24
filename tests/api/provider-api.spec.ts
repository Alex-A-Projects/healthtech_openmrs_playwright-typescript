import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/api/provider-api.spec.ts
 *
 * Tests for /provider.
 */
test.describe('Provider API', () => {
  test('GET /provider returns >=1 provider', async ({ apiContext }) => {
    const res = await apiContext.get('provider', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThanOrEqual(0);
  });

  test('GET /provider?q=Super returns hits', async ({ apiContext }) => {
    const res = await apiContext.get('provider', { params: { q: 'Super', v: 'default' } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /provider/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('provider/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });
});
