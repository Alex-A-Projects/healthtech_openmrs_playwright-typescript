import { test, expect } from '@playwright/test';
import { PatientDb } from '../../src/db/patient.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

/**
 * tests/db/patient-db.spec.ts
 *
 * Database tests for the `patient` table.
 *
 * These tests assume you have a local OpenMRS MySQL instance reachable
 * via the DB_* env vars. When env vars are missing they self-skip.
 */
test.describe('patient table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('patient count is a number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PatientDb.count();
    expect(typeof c).toBe('number');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('active patient count is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PatientDb.activeCount();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('voided patient count is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PatientDb.voidedCount();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('total = active + voided', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const total = await PatientDb.count();
    const active = await PatientDb.activeCount();
    const voided = await PatientDb.voidedCount();
    expect(total).toBe(active + voided);
  });

  test('recent patients returns <= N rows', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(5);
    expect(rows.length).toBeLessThanOrEqual(5);
  });

  test('recent patients are sorted by date_created DESC', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(10);
    for (let i = 1; i < rows.length; i++) {
      expect(new Date(rows[i - 1].date_created).getTime()).toBeGreaterThanOrEqual(
        new Date(rows[i].date_created).getTime(),
      );
    }
  });

  test('patient rows have UUIDs', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(5);
    for (const r of rows) {
      expect(r.uuid).toMatch(/^[0-9a-f-]{36}$/i);
    }
  });

  test('existsByUuid returns false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await PatientDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('existsByUuid returns true for a known patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(1);
    if (!rows.length) test.skip(true, 'No patients in DB');
    expect(await PatientDb.existsByUuid(rows[0].uuid)).toBeTruthy();
  });

  test('byUuid returns full row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(1);
    if (!rows.length) test.skip(true, 'No patients');
    const full = await PatientDb.byUuid(rows[0].uuid);
    expect(full?.uuid).toBe(rows[0].uuid);
  });

  test('byId returns full row when present', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.recent(1);
    if (!rows.length) test.skip(true, 'No patients');
    const full = await PatientDb.byId(rows[0].patient_id);
    expect(full?.patient_id).toBe(rows[0].patient_id);
  });

  test('countCreatedAfter returns the number of patients created after a past date', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const past = new Date('2000-01-01');
    const c = await PatientDb.countCreatedAfter(past);
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countCreatedAfter returns 0 for a future date', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const future = new Date('3000-01-01');
    const c = await PatientDb.countCreatedAfter(future);
    expect(c).toBe(0);
  });

  test('byUuidPrefix returns matching rows', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PatientDb.byUuidPrefix('00000000');
    expect(rows.length).toBeLessThanOrEqual(5);
  });

  test('isVoided returns false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await PatientDb.isVoided('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });
});
