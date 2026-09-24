import { test, expect } from '@playwright/test';
import { ConceptDb } from '../../src/db/concept.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('concept table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('concept count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await ConceptDb.count();
    expect(c).toBeGreaterThan(0);
  });

  test('countRetired is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await ConceptDb.countRetired();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('existsByUuid is false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await ConceptDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await ConceptDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await ConceptDb.byId(0);
    expect(row).toBeUndefined();
  });

  test('existsByName is false for a never-used concept name', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await ConceptDb.existsByName('ZZZ_QA_NAME_NEVER')).toBeFalsy();
  });

  test('byDatatype returns >=0 rows for a known datatype', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await ConceptDb.byDatatype('Numeric');
    expect(Array.isArray(rows)).toBeTruthy();
  });

  test('every concept row has a UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await ConceptDb.byDatatype('Numeric', 5);
    for (const r of rows) {
      expect(r.uuid).toMatch(/^[0-9a-f-]{36}$/i);
    }
  });

  test('concept counts stay consistent', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const total = await ConceptDb.count();
    const retired = await ConceptDb.countRetired();
    expect(retired).toBeLessThanOrEqual(total);
  });
});
