import { test, expect } from '../../fixtures/testFixtures';
import { ObsApi } from '../../src/api/obs.api';
import { PatientApi } from '../../src/api/patient.api';
import { VisitApi } from '../../src/api/visit.api';
import { EncounterApi } from '../../src/api/encounter.api';
import { ENCOUNTER_TYPE_UUIDS, LOCATION_UUIDS, VISIT_TYPE_UUIDS } from '../../src/constants';
import { generatePatient } from '../../src/utils/data-generator';

/**
 * tests/api/obs-api.spec.ts
 *
 * Tests for /obs.
 */
test.describe('Obs API', () => {
  const obs = new ObsApi();
  const patientApi = new PatientApi();
  const visitApi = new VisitApi();
  const encApi = new EncounterApi();
  test.afterAll(async () => Promise.all([obs.dispose(), patientApi.dispose(), visitApi.dispose(), encApi.dispose()]));

  test('GET /obs returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('obs', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /obs/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('obs/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('POST /obs creates a numeric obs (weight)', async () => {
    const reg = generatePatient();
    const patient = await patientApi.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    const visit = await visitApi.start({
      patient: patient.uuid!,
      visitType: VISIT_TYPE_UUIDS.clinicOrHospitalVisit,
      location: LOCATION_UUIDS.inpatientWard,
      startDatetime: new Date().toISOString(),
    });
    const enc = await encApi.create({
      encounterDatetime: new Date().toISOString(),
      patient: patient.uuid!,
      encounterType: ENCOUNTER_TYPE_UUIDS.vitals,
      location: LOCATION_UUIDS.inpatientWard,
      visit: visit.uuid!,
    });

    const concept = 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1a'; // weight kg
    const created = await obs.create({
      concept,
      person: patient.person!.uuid!,
      obsDatetime: new Date().toISOString(),
      encounter: enc.uuid,
      value: 72,
      location: LOCATION_UUIDS.inpatientWard,
    });
    expect(created.uuid).toBeTruthy();
  });

  test('ObsApi.search filters by patient', async () => {
    const list = await patientApi.search('Super');
    const uuid = list.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const res = await obs.search({ patient: uuid, limit: 5 });
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('ObsApi.getByUuid returns one obs', async ({ apiContext }) => {
    const list = await apiContext.get('obs', { params: { v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No obs');
    const o = await obs.getByUuid(uuid);
    expect(o.uuid).toBe(uuid);
  });

  test('POST /obs without concept returns 400', async () => {
    const res = await obs.context().then((c) => c.post('obs', {
      data: { person: '00000000-0000-0000-0000-000000000000', obsDatetime: new Date().toISOString(), value: 1 },
    }));
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /obs without person returns 400', async () => {
    const res = await obs.context().then((c) => c.post('obs', {
      data: { concept: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1a', obsDatetime: new Date().toISOString(), value: 1 },
    }));
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /obs without obsDatetime returns 400', async () => {
    const res = await obs.context().then((c) => c.post('obs', {
      data: { concept: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1a', person: '00000000-0000-0000-0000-000000000000', value: 1 },
    }));
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('ObsApi.search filters by concept', async () => {
    const res = await obs.search({ concept: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1a', limit: 5 });
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('GET /obs supports date range filter', async ({ apiContext }) => {
    const res = await apiContext.get('obs', {
      params: { v: 'default', limit: 5, fromdate: '2010-01-01', todate: '2099-01-01' },
    });
    expect(res.ok()).toBeTruthy();
  });
});
