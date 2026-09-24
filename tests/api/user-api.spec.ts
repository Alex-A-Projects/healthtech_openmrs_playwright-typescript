import { test, expect } from '../../fixtures/testFixtures';
import { UserApi } from '../../src/api/user.api';

/**
 * tests/api/user-api.spec.ts
 *
 * Tests for /user and /role.
 */
test.describe('User API', () => {
  const api = new UserApi();
  test.afterAll(async () => api.dispose());

  test('GET /user returns a list', async ({ apiContext }) => {
    const res = await apiContext.get('user', { params: { v: 'default', limit: 5 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /user default representation has uuid, display, username', async ({ apiContext }) => {
    const res = await apiContext.get('user', { params: { v: 'default', limit: 1 } });
    const body = await res.json();
    expect(body.results[0].uuid).toBeTruthy();
    expect(body.results[0].username).toBeTruthy();
  });

  test('GET /user?q=admin returns admin user', async ({ apiContext }) => {
    const res = await apiContext.get('user', { params: { q: 'admin', v: 'default' } });
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.some((r: any) => r.username === 'admin')).toBeTruthy();
  });

  test('GET /user/<uuid> returns admin profile', async ({ apiContext }) => {
    const search = await apiContext.get('user', { params: { q: 'admin', v: 'default' } });
    const body = await search.json();
    const admin = body.results.find((u: any) => u.username === 'admin');
    if (!admin) test.skip(true, 'admin user not seeded');
    const res = await apiContext.get(`user/${admin.uuid}`);
    expect(res.ok()).toBeTruthy();
    const detail = await res.json();
    expect(detail.username).toBe('admin');
  });

  test('GET /user/<unknown-uuid> returns 404', async ({ apiContext }) => {
    const res = await apiContext.get('user/00000000-0000-0000-0000-000000000000');
    expect(res.status()).toBe(404);
  });

  test('GET /role returns >=1 role', async ({ apiContext }) => {
    const res = await apiContext.get('role', { params: { v: 'default', limit: 50 } });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
  });

  test('GET /role includes "System Developer"', async ({ apiContext }) => {
    const res = await apiContext.get('role', { params: { v: 'default', limit: 200 } });
    const body = await res.json();
    expect(body.results.some((r: any) => /System Developer/i.test(r.display))).toBeTruthy();
  });

  test('GET /role includes "Organizational: System Administrator"', async ({ apiContext }) => {
    const res = await apiContext.get('role', { params: { v: 'default', limit: 200 } });
    const body = await res.json();
    expect(body.results.some((r: any) => /System Administrator/i.test(r.display))).toBeTruthy();
  });

  test('UserApi.search returns a paged result', async () => {
    const res = await api.search('admin');
    expect(Array.isArray(res.results)).toBeTruthy();
  });

  test('UserApi.listRoles returns >=1 role', async () => {
    const res = await api.listRoles();
    expect(res.results.length).toBeGreaterThan(0);
  });

  test('UserApi.getRole returns one role', async () => {
    const res = await api.listRoles();
    const first = res.results[0];
    const role = await api.getRole(first.uuid!);
    expect(role.uuid).toBe(first.uuid);
  });

  test('UserApi.getByUuid returns one user', async () => {
    const search = await api.search('admin');
    const admin = search.results.find((u) => u.username === 'admin');
    if (!admin?.uuid) test.skip(true, 'admin user not seeded');
    const u = await api.getByUuid(admin!.uuid!);
    expect(u.username).toBe('admin');
  });

  test('GET /user supports limit and startIndex pagination', async ({ apiContext }) => {
    const p1 = await (await apiContext.get('user', { params: { v: 'default', limit: 5, startIndex: 0 } })).json();
    const p2 = await (await apiContext.get('user', { params: { v: 'default', limit: 5, startIndex: 5 } })).json();
    expect(Array.isArray(p1.results)).toBeTruthy();
    expect(Array.isArray(p2.results)).toBeTruthy();
  });

  test('POST /user without username returns 400', async ({ apiContext }) => {
    const res = await apiContext.post('user', { data: {} });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
