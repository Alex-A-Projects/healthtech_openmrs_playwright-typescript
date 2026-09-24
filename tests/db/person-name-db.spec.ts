import { test, expect } from '@playwright/test';
import { PersonNameDb } from '../../src/db/person_name.db';
import { PatientDb } from '../../src/db/patient.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('person_name table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('byPersonId returns 1+ name rows for a known patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const personId = patient[0].patient_id;
    const names = await PersonNameDb.byPersonId(personId);
    expect(names.length).toBeGreaterThan(0);
  });

  test('every person_name row has a UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const names = await PersonNameDb.byPersonId(patient[0].patient_id);
    for (const n of names) {
      expect(n.uuid).toMatch(/^[0-9a-f-]{36}$/i);
    }
  });

  test('preferredForPerson returns exactly one row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const pref = await PersonNameDb.preferredForPerson(patient[0].patient_id);
    expect(pref).toBeTruthy();
    expect(pref!.preferred).toBe(1);
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await PersonNameDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('existsByGivenName is false for a never-used name', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await PersonNameDb.existsByGivenName('ZZZ_QANAME_XYZ')).toBeFalsy();
  });

  test('name rows have a given_name and family_name', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const names = await PersonNameDb.byPersonId(patient[0].patient_id);
    for (const n of names) {
      expect(typeof n.given_name).toBe('string');
      expect(typeof n.family_name).toBe('string');
    }
  });
});
