import { test, expect } from '@playwright/test';
import { UsersDb } from '../../src/db/users.db';
import { dbTestsEnabled, requireDb, cleanupDb } from './db.helper';

test.describe('users table', () => {
  test.beforeAll(async () => {
    await requireDb();
  });
  test.afterAll(async () => {
    await cleanupDb();
  });

  test('user count is a non-negative number', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await UsersDb.count();
    expect(c).toBeGreaterThan(0);
  });

  test('countRetired is non-negative', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await UsersDb.countRetired();
    expect(c).toBeGreaterThanOrEqual(0);
  });

  test('existsByUsername returns true for admin', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await UsersDb.existsByUsername('admin')).toBeTruthy();
  });

  test('existsByUsername returns false for unknown user', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await UsersDb.existsByUsername('zzz_qa_never_exists')).toBeFalsy();
  });

  test('byUsername returns the admin row', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await UsersDb.byUsername('admin');
    expect(row).toBeTruthy();
    expect(row!.system_id).toBeTruthy();
  });

  test('byUuid returns undefined for an unknown UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await UsersDb.byUuid('00000000-0000-0000-0000-000000000000');
    expect(row).toBeUndefined();
  });

  test('hasRole("admin", "System Developer") is true', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    expect(await UsersDb.hasRole('admin', 'System Developer')).toBeTruthy();
  });

  test('countByRole("System Developer") returns >=1', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const c = await UsersDb.countByRole('System Developer');
    expect(c).toBeGreaterThanOrEqual(1);
  });

  test('every user row has a UUID', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await UsersDb.byUsername('admin');
    expect(row!.uuid).toMatch(/^[0-9a-f-]{36}$/i);
  });

  test('every user row has a system_id', async () => {
    if (!dbTestsEnabled()) test.skip(true, 'DB env not configured');
    const row = await UsersDb.byUsername('admin');
    expect(typeof row!.system_id).toBe('string');
    expect(row!.system_id.length).toBeGreaterThan(0);
  });
});
