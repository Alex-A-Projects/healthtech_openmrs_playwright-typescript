import { test, expect } from '@playwright/test';
import { ObsDb } from '../../src/db/obs.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('obs table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('obs count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await ObsDb.count();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countVoided is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await ObsDb.countVoided();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('existsByUuid is false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await ObsDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await ObsDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await ObsDb.byId(0);
    expect(row).toBeUndefined();
  });

  test('countByPerson returns 0 for non-existent person', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await ObsDb.countByPerson(0);
    expect(c).toBe(0);
  });

  test('byPersonId returns an array', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const list = await ObsDb.byPersonId(0);
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('byEncounterId returns an array', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const list = await ObsDb.byEncounterId(0);
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('byConceptName accepts a string and returns array', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const list = await ObsDb.byConceptName('Weight');
    expect(Array.isArray(list)).toBeTruthy();
  });
});
