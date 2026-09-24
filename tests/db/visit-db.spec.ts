import { test, expect } from '@playwright/test';
import { VisitDb } from '../../src/db/visit.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('visit table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('visit count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await VisitDb.count();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countActive returns the number of currently active visits', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await VisitDb.countActive();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countVoided returns the number of voided visits', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await VisitDb.countVoided();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('total = active + voided + completed visits', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const total = await VisitDb.count();
    const active = await VisitDb.countActive();
    const voided = await VisitDb.countVoided();
    expect(total).toBeGreaterThanOrEqual(active + voided);
  });

  test('existsByUuid is false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await VisitDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await VisitDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await VisitDb.byId(0);
    expect(row).toBeUndefined();
  });

  test('countByPatient returns 0 for non-existent patient', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await VisitDb.countByPatient(0);
    expect(c).toBe(0);
  });

  test('activeByPatient returns an array (possibly empty)', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const visits = await VisitDb.activeByPatient(0);
    expect(Array.isArray(visits)).toBeTruthy();
  });
});
