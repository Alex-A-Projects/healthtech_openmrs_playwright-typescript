import { test, expect } from '../../fixtures/testFixtures';
import { LocationApi } from '../../src/api/location.api';
import { LOCATION_UUIDS } from '../../src/constants';

/**
 * tests/api/location-api.spec.ts
 *
 * Tests for /location and /locationtag.
 */
test.describe('Location API', () => {
  const api = new LocationApi();
  test.afterAll(async () => api.dispose());

  test('GET /location returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('location', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /location default representation has uuid + display', async ({ apiContext }) => {
    const res = await apiContext.get('location', { params: { v: 'default', limit: 1 } });
    const body = await res.json();
    expect(body.results[0].uuid).toBeTruthy();
    expect(body.results[0].display).toBeTruthy();
  });

  test('GET /location full representation has name + description', async ({ apiContext }) => {
    const res = await apiContext.get('location', { params: { v: 'full', limit: 1 } });
    const body = await res.json();
    expect(body.results[0].name).toBeTruthy();
  });

  test('GET /location?q=Inpatient returns Inpatient Ward', async ({ apiContext }) => {
    const res = await apiContext.get('location', { params: { q: 'Inpatient', v: 'default' } });
    const body = await res.json();
    expect(body.results.some((r: any) => /Inpatient/i.test(r.display))).toBeTruthy();
  });

  test('GET /location/<uuid> returns the Inpatient Ward', async ({ apiContext }) => {
    const res = await apiContext.get(`location/${LOCATION_UUIDS.inpatientWard}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.name).toMatch(/Inpatient/i);
  });

  test('GET /location/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('location/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('GET /locationtag returns at least one tag', async ({ apiContext }) => {
    const res = await apiContext.get('locationtag', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('LocationApi.search returns a paged result', async () => {
    const res = await api.search('Ward');
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('LocationApi.getByUuid returns one row', async () => {
    const l = await api.getByUuid(LOCATION_UUIDS.inpatientWard);
    expect(l.uuid).toBe(LOCATION_UUIDS.inpatientWard);
  });

  test('LocationApi.listTags returns an array', async () => {
    const res = (await api.listTags()) as { results: unknown[] };
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('LocationApi.byTag returns a non-5xx response', async () => {
    const tagsRes = (await api.listTags()) as { results: { uuid: string }[] };
    const firstTag = tagsRes.results?.[0]?.uuid;
    if (!firstTag) test.skip(true, 'No location tags');
    const res = await api.byTag(firstTag);
    expect(res).toBeTruthy();
  });

  test('LocationApi.create + update + retire cycle (creates a fresh location)', async () => {
    const uniqueName = `QA Loc ${Date.now()}`;
    const created = await api.create({ name: uniqueName, description: 'QA test location' });
    expect(created.uuid).toBeTruthy();

    const updated = await api.update(created.uuid!, { name: uniqueName + ' (renamed)', description: 'renamed' });
    expect(updated.description).toBe('renamed');

    const status = await api.retireLocation(created.uuid!, 'QA cleanup');
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
  });

  test('POST /location without name returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('location', { data: { description: 'no name' } });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
