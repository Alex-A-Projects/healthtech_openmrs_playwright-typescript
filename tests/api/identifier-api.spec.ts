import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/api/identifier-api.spec.ts
 *
 * Tests for /patientidentifiertype.
 */
test.describe('Identifier Type API', () => {
  test('GET /patientidentifiertype returns >=1 type', async ({ apiContext }) => {
    const res = await apiContext.get('patientidentifiertype', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /patientidentifiertype includes OpenMRS ID', async ({ apiContext }) => {
    const res = await apiContext.get('patientidentifiertype', { params: { v: 'default', limit: 50 } });
    const body = await res.json();
    expect(body.results.some((t: any) => /OpenMRS ID/i.test(t.display))).toBeTruthy();
  });

  test('GET /patientidentifiertype/<uuid> returns OpenMRS ID type', async ({ apiContext }) => {
    const res = await apiContext.get('patientidentifiertype/05a29f94-c0ed-11e2-94be-8c13b969e334');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.display).toMatch(/OpenMRS ID/i);
  });

  test('GET /patientidentifiertype/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('patientidentifiertype/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });
});
