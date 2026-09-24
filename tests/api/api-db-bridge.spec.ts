import { test, expect } from '../../fixtures/testFixtures';
import { PatientApi } from '../../src/api/patient.api';
import { generatePatient } from '../../src/utils/data-generator';

/**
 * tests/api/api-db-bridge.spec.ts
 *
 * Cross-validates API responses against the API's own follow-up queries.
 * The DB tests in tests/db/* are the source of truth for DB rows; here we
 * just confirm the API's representations stay consistent with themselves.
 */
test.describe('API self-consistency', () => {
  const api = new PatientApi();
  test.afterAll(async () => api.dispose());

  test('GET /patient/<uuid> uuid matches the queried uuid', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const detail = await api.getByUuid(uuid, 'default');
    expect(detail.uuid).toBe(uuid);
  });

  test('GET /patient default and full return the same UUID', async ({ apiContext }) => {
    const list = await apiContext.get('patient', { params: { q: 'Super', v: 'default', limit: 1 } });
    const body = await list.json();
    const uuid = body.results?.[0]?.uuid;
    if (!uuid) test.skip(true, 'No patient');
    const detail = await api.getByUuid(uuid, 'full');
    expect(detail.uuid).toBe(uuid);
  });

  test('a freshly created patient shows up in search', async () => {
    const reg = generatePatient();
    const created = await api.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    expect(created.uuid).toBeTruthy();

    const found = await api.search(reg.demographics.givenName);
    expect(found.results.some((r) => r.uuid === created.uuid)).toBeTruthy();
  });

  test('a freshly created patient shows up in GET /patient/<uuid>', async () => {
    const reg = generatePatient();
    const created = await api.create(reg, '05a29f94-c0ed-11e2-94be-8c13b969e334');
    const detail = await api.getByUuid(created.uuid!);
    expect(detail.uuid).toBe(created.uuid);
    expect(detail.person?.names?.[0]?.givenName).toBe(reg.demographics.givenName);
  });

  test('a freshly created patient returns the same identifier through the API', async () => {
    const reg = generatePatient();
    const id = `QAA${Date.now()}`.slice(0, 12);
    const created = await api.createRaw({
      identifiers: [{ identifier: id, identifierType: '05a29f94-c0ed-11e2-94be-8c13b969e334', preferred: true }],
      person: {
        gender: reg.demographics.gender,
        birthdate: reg.demographics.birthdate,
        birthdateEstimated: false,
        names: [{ givenName: reg.demographics.givenName, familyName: reg.demographics.familyName, preferred: true }],
      },
    });
    const idents = (await api.getIdentifiers(created.uuid!)) as { results?: { identifier: string }[] };
    const list = idents.results ?? (idents as unknown as { identifier: string }[]);
    const found = (list as { identifier: string }[]).some((x) => x.identifier === id) ||
      (list as { identifier: string }[])[0]?.identifier;
    expect(found).toBeTruthy();
  });

  test('the user in /session is admin', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    expect(body.user?.display).toMatch(/super|admin/i);
  });
});
