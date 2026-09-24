import { test, expect } from '../../fixtures/testFixtures';
import { EncounterApi } from '../../src/api/encounter.api';
import { PatientApi } from '../../src/api/patient.api';
import { VisitApi } from '../../src/api/visit.api';
import { ENCOUNTER_TYPE_UUIDS, LOCATION_UUIDS, VISIT_TYPE_UUIDS } from '../../src/constants';
import { generatePatient } from '../../src/utils/data-generator';

/**
 * tests/api/encounter-api.spec.ts
 *
 * Tests for /encounter and /encountertype endpoints.
 */
test.describe('Encounter API', () => {
  const api = new EncounterApi();
  const patientApi = new PatientApi();
  const visitApi = new VisitApi();
  test.afterAll(async () => Promise.all([api.dispose(), patientApi.dispose(), visitApi.dispose()]));

  test('GET /encounter?q= returns hits', async ({ apiContext }) => {
    const res = await apiContext.get('encounter', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /encountertype returns a list of types', async ({ apiContext }) => {
    const res = await apiContext.get('encountertype', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /encountertype/<uuid> returns the Vitals type', async ({ apiContext }) => {
    const res = await apiContext.get(`encountertype/${ENCOUNTER_TYPE_UUIDS.vitals}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.display).toBeTruthy();
  });

  test('GET /encounter/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('encounter/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('POST /encounter creates a Vitals encounter for a new patient', async ({ apiContext }) => {
    // Create a patient + visit first.
    const reg = generatePatient();
    const patient = await patientApi.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    expect(patient.uuid).toBeTruthy();

    const visit = await visitApi.start({
      patient: patient.uuid!,
      visitType: VISIT_TYPE_UUIDS.clinicOrHospitalVisit,
      location: LOCATION_UUIDS.inpatientWard,
      startDatetime: new Date().toISOString(),
    });
    expect(visit.uuid).toBeTruthy();

    const enc = await api.create({
      encounterDatetime: new Date().toISOString(),
      patient: patient.uuid!,
      encounterType: ENCOUNTER_TYPE_UUIDS.vitals,
      location: LOCATION_UUIDS.inpatientWard,
      visit: visit.uuid!,
    });
    expect(enc.uuid).toBeTruthy();
    expect(enc.encounterType).toBe(ENCOUNTER_TYPE_UUIDS.vitals);
  });

  test('EncounterApi.search filters by patient', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const res = await api.search({ patient: uuid, limit: 5 });
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('EncounterApi.getByUuid returns one encounter', async ({ apiContext }) => {
    const list = await apiContext.get('encounter', { params: { v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No encounter');
    const e = await api.getByUuid(uuid);
    expect(e.uuid).toBe(uuid);
  });

  test('EncounterApi.listEncounterTypes returns >=1 type', async () => {
    const res = (await api.listEncounterTypes()) as { results: unknown[] };
    expect(res.results.length).toBeGreaterThan(0);
  });

  test('GET /encounter supports date range filtering', async ({ apiContext }) => {
    const res = await apiContext.get('encounter', {
      params: {
        v: 'default',
        limit: 5,
        fromdate: '2010-01-01',
        todate: '2099-01-01',
      },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('GET /encounter?patient=<uuid> returns that patient encounters', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const res = await apiContext.get('encounter', { params: { patient: uuid, v: 'default', limit: 10 } });
    expect(res.ok()).toBeTruthy();
    const encs = await res.json();
    expect(Array.isArray(encs.results)).toBeTruthy();
  });

  test('POST /encounter without patient returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('encounter', {
      data: {
        encounterDatetime: new Date().toISOString(),
        encounterType: ENCOUNTER_TYPE_UUIDS.vitals,
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /encounter without encounterType returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('encounter', {
      data: { encounterDatetime: new Date().toISOString(), patient: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
