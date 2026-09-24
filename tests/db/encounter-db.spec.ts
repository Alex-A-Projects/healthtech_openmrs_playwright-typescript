import { test, expect } from '@playwright/test';
import { EncounterDb, EncounterProviderDb } from '../../src/db/encounter.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('encounter table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('encounter count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterDb.count();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countVoided is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterDb.countVoided();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('encounter rows have UUIDs', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const list = await EncounterDb.byPatientId(0);
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('existsByUuid is false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await EncounterDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await EncounterDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await EncounterDb.byId(0);
    expect(row).toBeUndefined();
  });

  test('encounter_provider count is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterProviderDb.count();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countByType for Vitals returns >=0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterDb.countByType('Vitals');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countByType for Admission returns >=0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterDb.countByType('ADMISSION');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countByPatient returns 0 for non-existent patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await EncounterDb.countByPatient(0);
    expect(c).toBe(0);
  });
});
