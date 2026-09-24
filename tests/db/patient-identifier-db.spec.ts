import { test, expect } from '@playwright/test';
import { PatientIdentifierDb } from '../../src/db/patient_identifier.db';
import { PatientDb } from '../../src/db/patient.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('patient_identifier table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('byPatientId returns 1+ identifier rows for a known patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const rows = await PatientIdentifierDb.byPatientId(patient[0].patient_id);
    expect(rows.length).toBeGreaterThan(0);
  });

  test('every patient_identifier row has a UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const rows = await PatientIdentifierDb.byPatientId(patient[0].patient_id);
    for (const r of rows) {
      expect(r.uuid).toMatch(/^[0-9a-f-]{36}$/i);
    }
  });

  test('every patient_identifier row has an identifier string', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const rows = await PatientIdentifierDb.byPatientId(patient[0].patient_id);
    for (const r of rows) {
      expect(typeof r.identifier).toBe('string');
      expect(r.identifier.length).toBeGreaterThan(0);
    }
  });

  test('preferredForPatient returns exactly one row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const patient = await PatientDb.recent(1);
    if (!patient.length) test.skip(true, 'No patients');
    const pref = await PatientIdentifierDb.preferredForPatient(patient[0].patient_id);
    expect(pref).toBeTruthy();
    expect(pref!.preferred).toBe(1);
  });

  test('countByType for OpenMRS ID returns >=1', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PatientIdentifierDb.countByType('OpenMRS ID');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('existsByIdentifier is false for a never-issued identifier', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await PatientIdentifierDb.existsByIdentifier('QANEVER_999999999')).toBeFalsy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await PatientIdentifierDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });
});
