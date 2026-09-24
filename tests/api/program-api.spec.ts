import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/api/program-api.spec.ts
 *
 * Tests for /program.
 */
test.describe('Program API', () => {
  test('GET /program returns a list of programs', async ({ apiContext }) => {
    const res = await apiContext.get('program', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /program/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('program/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });
});
