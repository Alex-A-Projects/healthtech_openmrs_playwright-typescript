/**
 * global-setup.ts — runs ONCE before the entire suite.
 *
 * Two jobs:
 *   1. Probe O2 to confirm the host is reachable.
 *   2. Persist the result to `.o2-status.json` so each spec can skip
 *      cleanly when O2 is unavailable (e.g. Cloudflare 403).
 *
 * Failure handling:
 *   - HTTP 200                  → healthy, proceed.
 *   - HTTP 403/503              → Cloudflare block. Fail fast (no retry).
 *   - Other (5xx, timeout)      → retry with backoff, then mark unavailable.
 */
import { request } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const BASE = process.env.O2_BASE_URL ?? 'https://o2.openmrs.org/openmrs';
const MAX_ATTEMPTS = 6;
const WAIT_MS = 5_000;
const CLOUDFLARE_BLOCK_CODES = new Set([403, 503]);
const STATUS_FILE = path.resolve(process.cwd(), '.o2-status.json');

export interface O2Status {
  available: boolean;
  status: number | null;
  reason: string;
  checkedAt: string;
}

function writeStatus(status: O2Status): void {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
  } catch {
    /* best effort — file write shouldn't fail the suite */
  }
}

export default async function globalSetup() {
  const cfClearance = process.env.CF_CLEARANCE ?? '';

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    let status = 0;
    let error: string | undefined;

    try {
      const ctx = await request.newContext();
      // If CF_CLEARANCE is set, attach it as a Cookie header so the probe
      // itself bypasses the JS challenge.
      const headers: Record<string, string> = {};
      if (cfClearance) {
        const host = new URL(BASE).hostname;
        headers['Cookie'] = `cf_clearance=${cfClearance}`;
        void host; // (kept for symmetry; the cookie is host-agnostic in this header)
      }
      const res = await ctx.get(`${BASE}/login.htm`, { timeout: 10_000, headers });
      status = res.status();
      await ctx.dispose();
    } catch (err) {
      error = (err as Error).message;
    }

    if (status === 200) {
      console.log(`[global-setup] O2 healthy (attempt ${i + 1}/${MAX_ATTEMPTS}).`);
      writeStatus({
        available: true,
        status: 200,
        reason: 'healthy',
        checkedAt: new Date().toISOString(),
      });
      return;
    }

    if (CLOUDFLARE_BLOCK_CODES.has(status)) {
      const reason = cfClearance
        ? `Cloudflare block (HTTP ${status}) — your CF_CLEARANCE cookie may have expired. Refresh it from your browser.`
        : `Cloudflare block (HTTP ${status}) — set CF_CLEARANCE in .env, or wait 10–15 minutes for the rate limit to lift.`;
      console.warn(`[global-setup] ${reason}`);
      writeStatus({
        available: false,
        status,
        reason,
        checkedAt: new Date().toISOString(),
      });
      return;
    }

    if (error) {
      console.warn(`[global-setup] Probe failed: ${error}.`);
    } else {
      console.warn(`[global-setup] O2 returned ${status}, attempt ${i + 1}/${MAX_ATTEMPTS}.`);
    }

    if (i < MAX_ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, WAIT_MS));
    }
  }

  console.warn(`[global-setup] O2 still unhealthy after ${MAX_ATTEMPTS} probes.`);
  writeStatus({
    available: false,
    status: null,
    reason: `Unreachable after ${MAX_ATTEMPTS} probes`,
    checkedAt: new Date().toISOString(),
  });
}
