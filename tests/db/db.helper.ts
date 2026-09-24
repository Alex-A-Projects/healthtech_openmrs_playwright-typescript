import { DbConnection } from '../../src/db/connection';

/**
 * Shared helpers for DB test specs.
 *
 * Tests self-skip when DB env vars are not configured (DB_SKIP_IF_MISSING=true).
 * Each spec calls `requireDb()` in `beforeAll` to short-circuit.
 */

export function dbTestsEnabled(): boolean {
  return DbConnection.isConfigured();
}

export async function requireDb(): Promise<void> {
  if (!dbTestsEnabled()) {
    const msg = 'Skipping DB tests: DB_HOST/DB_USER/DB_NAME not configured.';
    console.warn(`[db-tests] ${msg}`);
  }
}

export async function cleanupDb(): Promise<void> {
  try {
    await DbConnection.close();
  } catch {
    /* best effort */
  }
}
