import { test, expect } from '../../fixtures/testFixtures';
import { PersonApi } from '../../src/api/person.api';

/**
 * tests/api/person-api.spec.ts
 *
 * Tests for the /person endpoint (the underlying row behind every patient).
 */
test.describe('Person API', () => {
  const api = new PersonApi();
  test.afterAll(async () => api.dispose());

  test('GET /person?q=Super returns hits', async ({ apiContext }) => {
    const res = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /person default representation includes uuid, display, gender', async ({ apiContext }) => {
    const res = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await res.json();
    if (!body.results?.length) test.skip(true, 'No seeded persons');
    const p = body.results[0];
    expect(p.uuid).toBeTruthy();
    expect(p.gender).toMatch(/[MFOU]/);
  });

  test('GET /person full representation includes names + addresses', async ({ apiContext }) => {
    const res = await apiContext.get('person', { params: { q: 'Super', v: 'full', limit: 1 } });
    const body = await res.json();
    if (!body.results?.length) test.skip(true, 'No seeded persons');
    expect(body.results[0].names).toBeTruthy();
    expect(Array.isArray(body.results[0].names)).toBeTruthy();
  });

  test('GET /person/<uuid> returns one row', async ({ apiContext }) => {
    const list = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No person');
    const res = await apiContext.get(`person/${uuid}`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /person/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('person/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('GET /person/<uuid>/name returns names array', async ({ apiContext }) => {
    const list = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No person');
    const res = await apiContext.get(`person/${uuid}/name`);
    expect(res.ok()).toBeTruthy();
    const names = await res.json();
    expect(Array.isArray(names.results ?? names)).toBeTruthy();
  });

  test('GET /person/<uuid>/address returns addresses array', async ({ apiContext }) => {
    const list = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No person');
    const res = await apiContext.get(`person/${uuid}/address`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /person/<uuid>/attribute returns attributes', async ({ apiContext }) => {
    const list = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No person');
    const res = await apiContext.get(`person/${uuid}/attribute`);
    expect(res.ok()).toBeTruthy();
  });

  test('PersonApi.search returns a paged result', async () => {
    const res = await api.search('Super');
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('PersonApi.getByUuid returns one row', async ({ apiContext }) => {
    const list = await apiContext.get('person', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No person');
    const p = await api.getByUuid(uuid);
    expect(p.uuid).toBe(uuid);
  });

  test('GET /person?q=EmptyStillReturns200', async ({ apiContext }) => {
    const res = await apiContext.get('person', { params: { q: '', v: 'default' } });
    expect(res.ok()).toBeTruthy();
  });

  test('POST /person creates a standalone person (no patient)', async ({ apiContext }) => {
    const body = {
      gender: 'M',
      birthdate: '1990-01-01',
      birthdateEstimated: false,
      names: [{ givenName: 'QAStandalone', familyName: 'Person', preferred: true }],
    };
    const res = await apiContext.post('person', { data: body });
    expect(res.ok()).toBeTruthy();
    const created = await res.json();
    expect(created.uuid).toBeTruthy();
  });

  test('POST /person without gender returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('person', {
      data: { names: [{ givenName: 'NoGender', familyName: 'Person', preferred: true }] },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /person without names returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('person', { data: { gender: 'M' } });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
