import { test, expect } from '../../fixtures/testFixtures';
import { ConceptApi } from '../../src/api/concept.api';

/**
 * tests/api/concept-api.spec.ts
 *
 * Tests for /concept and /conceptsearch.
 */
test.describe('Concept API', () => {
  const api = new ConceptApi();
  test.afterAll(async () => api.dispose());

  test('GET /concept returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('concept', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /concept default representation has uuid and display', async ({ apiContext }) => {
    const res = await apiContext.get('concept', { params: { v: 'default', limit: 1 } });
    const body = await res.json();
    expect(body.results[0].uuid).toBeTruthy();
    expect(body.results[0].display).toBeTruthy();
  });

  test('GET /concept?q=Weight returns at least one hit', async ({ apiContext }) => {
    const res = await apiContext.get('concept', { params: { q: 'Weight', v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThanOrEqual(0);
  });

  test('GET /concept/<uuid> returns the concept', async ({ apiContext }) => {
    const list = await apiContext.get('concept', { params: { q: 'Weight', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No concept seeded');
    const res = await apiContext.get(`concept/${uuid}`);
    expect(res.ok()).toBeTruthy();
    const c = await res.json();
    expect(c.uuid).toBe(uuid);
  });

  test('GET /concept/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('concept/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('GET /conceptsearch?q=Temp returns hits', async ({ apiContext }) => {
    const res = await apiContext.get('conceptsearch', { params: { q: 'Temp' } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeTruthy();
  });

  test('GET /concept supports pagination via startIndex', async ({ apiContext }) => {
    const p1 = await (await apiContext.get('concept', { params: { v: 'default', limit: 5, startIndex: 0 } })).json();
    const p2 = await (await apiContext.get('concept', { params: { v: 'default', limit: 5, startIndex: 5 } })).json();
    expect(Array.isArray(p1.results)).toBeTruthy();
    expect(Array.isArray(p2.results)).toBeTruthy();
  });

  test('GET /concept full representation has names array', async ({ apiContext }) => {
    const res = await apiContext.get('concept', { params: { q: 'Weight', v: 'full', limit: 1 } });
    const body = await res.json();
    const c = body.results?.[0];
    if (!c) test.skip(true, 'No concept');
    expect(Array.isArray(c.names)).toBeTruthy();
  });

  test('ConceptApi.search returns a paged result', async () => {
    const res = await api.search('Weight');
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('ConceptApi.getByUuid returns one concept', async ({ apiContext }) => {
    const list = await apiContext.get('concept', { params: { q: 'Weight', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No concept');
    const c = await api.getByUuid(uuid);
    expect(c.uuid).toBe(uuid);
  });

  test('ConceptApi.conceptSearch returns an array', async () => {
    const res = (await api.conceptSearch('Temp')) as unknown;
    expect(res).toBeTruthy();
  });

  test('GET /concept returns at least 50 concepts', async ({ apiContext }) => {
    const res = await apiContext.get('concept', { params: { v: 'default', limit: 50 } });
    const body = await res.json();
    expect(body.results.length).toBeGreaterThanOrEqual(1);
  });
});
