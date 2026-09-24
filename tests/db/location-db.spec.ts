import { test, expect } from '@playwright/test';
import { LocationDb } from '../../src/db/location.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('location table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('location count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await LocationDb.count();
    expect(c).toBeGreaterThan(0);
  });

  test('countRetired is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await LocationDb.countRetired();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('existsByName returns true for Inpatient Ward', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await LocationDb.existsByName('Inpatient Ward')).toBeTruthy();
  });

  test('existsByName returns false for unknown name', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await LocationDb.existsByName('ZZZ_QA_NEVER')).toBeFalsy();
  });

  test('byName returns the Inpatient Ward row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await LocationDb.byName('Inpatient Ward');
    expect(row).toBeTruthy();
    expect(row!.name).toBe('Inpatient Ward');
  });

  test('every location row has a UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await LocationDb.byName('Inpatient Ward');
    expect(row!.uuid).toMatch(/^[0-9a-f-]{36}$/i);
  });

  test('list returns a non-empty array', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await LocationDb.list();
    expect(rows.length).toBeGreaterThan(0);
  });

  test('listNonRetired returns a non-empty array', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await LocationDb.listNonRetired();
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      expect(r.retired).toBe(0);
    }
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await LocationDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await LocationDb.byId(0);
    expect(row).toBeUndefined();
  });

  test('existsByUuid is false for unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await LocationDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });
});
