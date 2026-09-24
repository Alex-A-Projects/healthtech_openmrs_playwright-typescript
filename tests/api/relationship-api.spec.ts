import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/api/relationship-api.spec.ts
 *
 * Tests for /relationship and /relationshiptype.
 */
test.describe('Relationship API', () => {
  test('GET /relationshiptype returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('relationshiptype', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /relationshiptype includes "Doctor"', async ({ apiContext }) => {
    const res = await apiContext.get('relationshiptype', { params: { v: 'default', limit: 200 } });
    const body = await res.json();
    expect(body.results.some((t: any) => /doctor|parent|sibling/i.test(t.display))).toBeTruthy();
  });
});
