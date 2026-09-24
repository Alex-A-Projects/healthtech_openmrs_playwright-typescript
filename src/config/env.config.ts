import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized access to every environment variable used by the suite.
 * Keeping reads here means tests don't sprinkle process.env references
 * everywhere and makes it easy to fall back to sane defaults.
 */

export const env = {
  // UI / O2 demo
  o2: {
    baseUrl: process.env.O2_BASE_URL ?? 'https://o2.openmrs.org/openmrs',
    username: process.env.O2_USERNAME ?? 'admin',
    password: process.env.O2_PASSWORD ?? 'Admin123',
    location: process.env.O2_LOCATION ?? 'Inpatient Ward',
  },

  // REST API
  api: {
    // Always end with a trailing slash so `apiContext.get('session')`
    // resolves to `${baseUrl}session` instead of `${baseUrl-no-last-segment}session`.
    baseUrl: (process.env.API_BASE_URL ?? 'https://o2.openmrs.org/openmrs/ws/rest/v1').replace(
      /\/$/,
      '',
    ) + '/',
    sessionCachePath: process.env.API_SESSION_CACHE ?? './.api-session.json',
  },

  // DB
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'openmrs',
    password: process.env.DB_PASSWORD ?? 'openmrs',
    database: process.env.DB_NAME ?? 'openmrs',
    skipIfMissing: (process.env.DB_SKIP_IF_MISSING ?? 'true').toLowerCase() === 'true',
  },

  // Tuning
  actionDelayMs: Number(process.env.ACTION_DELAY_MS ?? 30),
  logLevel: process.env.LOG_LEVEL ?? 'info',

  // Cloudflare bypass (copy cf_clearance cookie from your browser).
  // Open o2.openmrs.org in Chrome → DevTools → Application → Cookies →
  // copy the `cf_clearance` value into this env var. Valid ~24h.
  cfClearance: process.env.CF_CLEARANCE ?? '',
  cfBm: process.env.CF_BM ?? '',
} as const;

/** True when DB env vars appear set. Used by DB tests to self-skip. */
export function dbEnvIsConfigured(): boolean {
  return Boolean(env.db.host && env.db.user && env.db.database);
}
