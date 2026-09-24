import { test, expect } from '../../fixtures/testFixtures';
import { VisitApi } from '../../src/api/visit.api';
import { PatientApi } from '../../src/api/patient.api';
import { VISIT_TYPE_UUIDS, LOCATION_UUIDS } from '../../src/constants';
import { generatePatient } from '../../src/utils/data-generator';

/**
 * tests/api/visit-api.spec.ts
 *
 * Tests for /visit and /visittype.
 */
test.describe('Visit API', () => {
  const visitApi = new VisitApi();
  const patientApi = new PatientApi();
  test.afterAll(async () => Promise.all([visitApi.dispose(), patientApi.dispose()]));

  test('GET /visit returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('visit', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.results)).toBeTruthy();
  });

  test('GET /visittype returns a list of types', async ({ apiContext }) => {
    const res = await apiContext.get('visittype', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /visittype/<uuid> returns the Clinic or Hospital Visit type', async ({ apiContext }) => {
    const res = await apiContext.get(`visittype/${VISIT_TYPE_UUIDS.clinicOrHospitalVisit}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.display).toBeTruthy();
  });

  test('GET /visit/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('visit/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('POST /visit starts a visit for a new patient', async () => {
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
    expect(visit.startDatetime).toBeTruthy();
  });

  test('POST /visit with Home Visit type works', async () => {
    const reg = generatePatient();
    const patient = await patientApi.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    const visit = await visitApi.start({
      patient: patient.uuid!,
      visitType: VISIT_TYPE_UUIDS.homeVisit,
      location: LOCATION_UUIDS.outpatientClinic,
      startDatetime: new Date().toISOString(),
    });
    expect(visit.uuid).toBeTruthy();
  });

  test('POST /visit without patient returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('visit', {
      data: { visitType: VISIT_TYPE_UUIDS.clinicOrHospitalVisit, startDatetime: new Date().toISOString() },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /visit without visitType returns 400', async () => {
    const reg = generatePatient();
    const patient = await patientApi.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    const res = await visitApi.context().then((c) => c.post('visit', {
      data: { patient: patient.uuid, startDatetime: new Date().toISOString() },
    }));
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('VisitApi.search filters by patient', async () => {
    const list = await visitApi.context().then((c) => c.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } }));
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const res = await visitApi.search({ patient: uuid });
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('VisitApi.getByUuid returns one visit', async ({ apiContext }) => {
    const list = await apiContext.get('visit', { params: { v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No visit');
    const v = await visitApi.getByUuid(uuid);
    expect(v.uuid).toBe(uuid);
  });

  test('VisitApi.listVisitTypes returns >=1 type', async () => {
    const res = (await visitApi.listVisitTypes()) as { results: unknown[] };
    expect(res.results.length).toBeGreaterThan(0);
  });

  test('VisitApi.getVisitType returns the named type', async () => {
    const t = await visitApi.getVisitType(VISIT_TYPE_UUIDS.clinicOrHospitalVisit);
    expect(t).toBeTruthy();
  });

  test('POST /visit/<uuid> with stopDatetime closes the visit', async () => {
    const reg = generatePatient();
    const patient = await patientApi.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    const visit = await visitApi.start({
      patient: patient.uuid!,
      visitType: VISIT_TYPE_UUIDS.clinicOrHospitalVisit,
      location: LOCATION_UUIDS.inpatientWard,
      startDatetime: new Date().toISOString(),
    });
    const updated = await visitApi.update(visit.uuid!, {
      patient: patient.uuid!,
      visitType: VISIT_TYPE_UUIDS.clinicOrHospitalVisit,
      startDatetime: visit.startDatetime!,
      stopDatetime: new Date().toISOString(),
    });
    expect(updated.stopDatetime).toBeTruthy();
  });
});
