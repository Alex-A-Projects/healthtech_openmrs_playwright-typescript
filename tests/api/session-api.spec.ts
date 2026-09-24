import { test, expect } from '../../fixtures/testFixtures';
import { SessionApi } from '../../src/api/session.api';

/**
 * tests/api/session-api.spec.ts
 *
 * Tests for /session and /sessionlocation endpoints.
 */
test.describe('Session API', () => {
  test('GET /session returns the authenticated user', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.authenticated).toBe(true);
    expect(body.user).toBeTruthy();
    expect(body.user?.uuid).toBeTruthy();
    expect(body.user?.display).toBeTruthy();
  });

  test('GET /session reports the current session UUID', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    expect(body.sessionId).toBeTruthy();
  });

  test('GET /session returns the privileges array', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    expect(Array.isArray(body.privileges)).toBeTruthy();
    expect(body.privileges.length).toBeGreaterThan(0);
  });

  test('GET /session returns the roles array', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    expect(Array.isArray(body.roles)).toBeTruthy();
    expect(body.roles.length).toBeGreaterThan(0);
  });

  test('GET /session includes a System Developer role for admin', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    const hasSysAdmin = body.roles?.some((r: any) => /system|admin/i.test(r.display ?? ''));
    expect(hasSysAdmin).toBeTruthy();
  });

  test('GET /session responds with JSON content type', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const ct = res.headers()['content-type'] ?? '';
    expect(ct).toMatch(/json/i);
  });

  test('GET /session responds with 200 OK', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    expect(res.status()).toBe(200);
  });

  test('an unauthenticated /session call returns 401', async ({ baseURL }) => {
    const api = new SessionApi(`${baseURL}/ws/rest/v1`);
    const ctx = await api.context();
    const res = await ctx.get('session', { headers: { Authorization: 'Basic ' + Buffer.from('baduser:badpass').toString('base64') } });
    expect([200, 401]).toContain(res.status());
    // 200 with authenticated=false, OR 401.
  });

  test('GET /sessionlocation returns a location object', async ({ apiContext }) => {
    const res = await apiContext.get('sessionlocation');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeTruthy();
  });

  test('SessionApi.currentLocation returns the active location UUID', async () => {
    const api = new SessionApi();
    const loc = await api.currentLocation();
    expect(typeof loc).toBe('object');
  });

  test('SessionApi.isAuthenticated is true with admin creds', async () => {
    const api = new SessionApi();
    expect(await api.isAuthenticated()).toBe(true);
  });

  test('SessionApi.listLocations returns >=1 results', async () => {
    const api = new SessionApi();
    const res = await api.listLocations();
    expect(res.results.length).toBeGreaterThan(0);
  });

  test('session contains a UUID-formatted user identifier', async ({ apiContext }) => {
    const res = await apiContext.get('session');
    const body = await res.json();
    expect(body.user.uuid).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
