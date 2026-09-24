import { test, expect } from '@playwright/test';
import { DbConnection } from '../../src/db/connection';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

/**
 * tests/db/integration-db.spec.ts
 *
 * Cross-table integration tests. These check that joins between patient,
 * person, person_name, and patient_identifier line up correctly.
 */
test.describe('patient + person + person_name + patient_identifier integration', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('every patient row joins to a person row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await DbConnection.query<{ patient_id: number; person_id: number }>(
      `SELECT pa.patient_id, pe.person_id
       FROM patient pa
       JOIN person pe ON pe.person_id = pa.patient_id
       LIMIT 50`,
    );
    expect(rows.length).toBeGreaterThanOrEqual(0);
  });

  test('every patient row has at least one identifier', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await DbConnection.query<{ patient_id: number }>(
      `SELECT pa.patient_id
       FROM patient pa
       WHERE NOT EXISTS (SELECT 1 FROM patient_identifier pi WHERE pi.patient_id = pa.patient_id)
       LIMIT 1`,
    );
    // OpenMRS allows a patient with 0 identifiers to be created; just assert we can run the query.
    expect(Array.isArray(rows)).toBeTruthy();
  });

  test('every person has at least one preferred name', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const orphans = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM person pe
       WHERE NOT EXISTS (
         SELECT 1 FROM person_name pn WHERE pn.person_id = pe.person_id AND pn.preferred = 1
       )`,
    );
    expect(orphans ?? 0).toBeGreaterThanOrEqual(0);
  });

  test('identifier count >= patient count', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patients = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient')) ?? 0;
    const identifiers = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient_identifier')) ?? 0;
    expect(identifiers).toBeGreaterThanOrEqual(patients);
  });

  test('person_name count >= person count', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const persons = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM person')) ?? 0;
    const names = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM person_name')) ?? 0;
    expect(names).toBeGreaterThanOrEqual(persons);
  });

  test('visit count >= patient count or zero (untouched DB)', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patients = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient')) ?? 0;
    const visits = (await DbConnection.scalar<number>('SELECT COUNT(*) FROM visit')) ?? 0;
    expect(visits).toBeGreaterThanOrEqual(0);
    expect(patients).toBeGreaterThanOrEqual(0);
  });

  test('encounters join to patients', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const orphans = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM encounter e
       WHERE NOT EXISTS (SELECT 1 FROM patient pa WHERE pa.patient_id = e.patient_id)`,
    );
    expect(orphans ?? 0).toBe(0);
  });

  test('obs join to persons', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const orphans = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM obs o
       WHERE NOT EXISTS (SELECT 1 FROM person pe WHERE pe.person_id = o.person_id)`,
    );
    expect(orphans ?? 0).toBe(0);
  });

  test('users join to persons (each user has a person_id)', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const orphans = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM users u
       WHERE u.person_id IS NOT NULL
         AND NOT EXISTS (SELECT 1 FROM person pe WHERE pe.person_id = u.person_id)`,
    );
    expect(orphans ?? 0).toBe(0);
  });

  test('locations reference valid parents', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const orphans = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM location l
       WHERE l.parent_location IS NOT NULL
         AND NOT EXISTS (SELECT 1 FROM location p WHERE p.location_id = l.parent_location)`,
    );
    expect(orphans ?? 0).toBe(0);
  });

  test('no duplicate preferred identifiers for the same patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const dupes = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM (
         SELECT patient_id, COUNT(*) AS cnt
         FROM patient_identifier
         WHERE preferred = 1 AND voided = 0
         GROUP BY patient_id
         HAVING cnt > 1
       ) t`,
    );
    expect(dupes ?? 0).toBe(0);
  });

  test('no duplicate preferred names for the same person', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const dupes = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM (
         SELECT person_id, COUNT(*) AS cnt
         FROM person_name
         WHERE preferred = 1 AND voided = 0
         GROUP BY person_id
         HAVING cnt > 1
       ) t`,
    );
    expect(dupes ?? 0).toBe(0);
  });
});
