import { test, expect } from '../../fixtures/testFixtures';
import { PatientApi } from '../../src/api/patient.api';
import { generatePatient } from '../../src/utils/data-generator';
import { IDENTIFIER_TYPE_UUIDS } from '../../src/constants';

/**
 * tests/api/patient-api.spec.ts
 *
 * Tests for the /patient endpoint (CRUD + search).
 */
test.describe('Patient API', () => {
  const api = new PatientApi();
  test.afterAll(async () => api.dispose());

  test('GET /patient returns a list of patients', async ({ apiContext }) => {
    const res = await apiContext.get('patient', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /patient default representation has uuid and display', async ({ apiContext }) => {
    const res = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    if (!body.results?.length) test.skip(true, 'No seeded patients');
    expect(body.results[0]).toHaveProperty('uuid');
    expect(body.results[0]).toHaveProperty('display');
  });

  test('GET /patient full representation has person + identifiers', async ({ apiContext }) => {
    const res = await apiContext.get('patient', { params: { q: 'Super', v: 'full', limit: 1 } });
    const body = await res.json();
    if (!body.results?.length) test.skip(true, 'No seeded patients');
    expect(body.results[0].identifiers).toBeTruthy();
    expect(body.results[0].person).toBeTruthy();
  });

  test('search by name "Super" returns at least one hit', async ({ apiContext }) => {
    const res = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 5 } });
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('search by empty term does not 5xx', async ({ apiContext }) => {
    const res = await apiContext.get('patient', { params: { q: '', v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
  });

  test('GET /patient/<uuid> returns the patient', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to fetch');
    const res = await apiContext.get(`patient/${uuid}`, { params: { v: 'default' } });
    expect(res.ok()).toBeTruthy();
    const single = await res.json();
    expect(single.uuid).toBe(uuid);
  });

  test('GET /patient/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('patient/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('POST /patient creates a new patient', async ({ apiContext }) => {
    const reg = generatePatient();
    const body = {
      identifiers: [
        { identifierType: IDENTIFIER_TYPE_UUIDS.openmrsId, preferred: true },
      ],
      person: {
        gender: reg.demographics.gender,
        birthdate: reg.demographics.birthdate,
        birthdateEstimated: reg.demographics.birthdateEstimated,
        names: [
          {
            givenName: reg.demographics.givenName,
            familyName: reg.demographics.familyName,
            preferred: true,
          },
        ],
        addresses: [
          {
            cityVillage: reg.address.city,
            country: reg.address.country,
            preferred: true,
          },
        ],
      },
    };
    const res = await apiContext.post('patient', { data: body });
    expect(res.ok()).toBeTruthy();
    const created = await res.json();
    expect(created.uuid).toBeTruthy();
    expect(created.person?.uuid).toBeTruthy();
  });

  test('POST /patient requires a person.names entry', async ({ apiContext }) => {
    const res = await apiContext.post('patient', {
      data: { identifiers: [{ identifierType: IDENTIFIER_TYPE_UUIDS.openmrsId, preferred: true }], person: { gender: 'M', birthdate: '1990-01-01' } },
    });
    // O2 returns 400 because names is required.
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /patient without gender returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('patient', {
      data: {
        identifiers: [{ identifierType: IDENTIFIER_TYPE_UUIDS.openmrsId, preferred: true }],
        person: { names: [{ givenName: 'NoGender', familyName: 'Person', preferred: true }] },
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /patient/<uuid>/identifiers returns an array', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to test');
    const res = await apiContext.get(`patient/${uuid}/identifiers`);
    expect(res.ok()).toBeTruthy();
    const idents = await res.json();
    expect(Array.isArray(idents.results ?? idents)).toBeTruthy();
  });

  test('GET /patient/<uuid>/visit returns visits', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to test');
    const res = await apiContext.get(`patient/${uuid}/visit`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /patient/<uuid>/encounter returns encounters', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to test');
    const res = await apiContext.get(`patient/${uuid}/encounter`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /patient/<uuid>/programEnrollment returns enrollments', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient to test');
    const res = await apiContext.get(`patient/${uuid}/programEnrollment`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /patient supports pagination via startIndex', async ({ apiContext }) => {
    const page1 = await (await apiContext.get('patient', { params: { v: 'default', limit: 5, startIndex: 0 } })).json();
    const page2 = await (await apiContext.get('patient', { params: { v: 'default', limit: 5, startIndex: 5 } })).json();
    expect(Array.isArray(page1.results)).toBeTruthy();
    expect(Array.isArray(page2.results)).toBeTruthy();
  });

  test('PatientApi.search returns a typed list', async () => {
    const res = await api.search('Super');
    expect(res.results.length).toBeGreaterThanOrEqual(0);
  });

  test('PatientApi.list returns paginated results', async () => {
    const res = await api.list({ limit: 5 });
    expect(res.results.length).toBeGreaterThanOrEqual(0);
  });

  test('POST /patient with a known identifier allows re-fetching it', async ({ apiContext }) => {
    const reg = generatePatient();
    const id = `QATEST${Date.now()}`.slice(0, 12);
    const body = {
      identifiers: [{ identifier: id, identifierType: IDENTIFIER_TYPE_UUIDS.openmrsId, preferred: true }],
      person: {
        gender: reg.demographics.gender,
        birthdate: reg.demographics.birthdate,
        birthdateEstimated: false,
        names: [{ givenName: reg.demographics.givenName, familyName: reg.demographics.familyName, preferred: true }],
      },
    };
    const res = await apiContext.post('patient', { data: body });
    expect(res.ok()).toBeTruthy();
    const created = await res.json();
    const find = await apiContext.get('patient', { params: { q: id, v: 'default' } });
    const found = await find.json();
    expect(found.results.some((r: any) => r.uuid === created.uuid)).toBeTruthy();
  });
});
