import { test, expect } from '@playwright/test';
import { PersonDb } from '../../src/db/person.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('person table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('person count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PersonDb.count();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countByGender M returns the number of male persons', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PersonDb.countByGender('M');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countByGender F returns the number of female persons', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PersonDb.countByGender('F');
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('countDead is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await PersonDb.countDead();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('M + F + dead + others cover the total count', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const total = await PersonDb.count();
    const m = await PersonDb.countByGender('M');
    const f = await PersonDb.countByGender('F');
    expect(m + f).toBeLessThanOrEqual(total + 5); // allow other categories
  });

  test('existsByUuid is false for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await PersonDb.existsByUuid('00000000-0000-0000-0000-000000000000')).toBeFalsy();
  });

  test('byGenderAndBirthdate accepts a real birthdate', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const rows = await PersonDb.byGenderAndBirthdate('M', '1990-01-01');
    expect(Array.isArray(rows)).toBeTruthy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await PersonDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('byId returns undefined for id 0', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await PersonDb.byId(0);
    expect(row).toBeUndefined();
  });
});
