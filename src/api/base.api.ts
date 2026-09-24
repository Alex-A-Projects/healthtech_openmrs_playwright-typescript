import { APIRequestContext, request as pwRequest } from '@playwright/test';
import { env } from '../config/env.config';
import { log } from '../utils/logger';

/**
 * Base API client for the OpenMRS REST endpoints.
 *
 * Centralizes:
 *  - URL composition (root + v1 path).
 *  - JSON header defaults.
 *  - Session/auth reuse via Basic auth header.
 *  - Convenience helpers for GET / POST / PUT / DELETE / DELETE-with-body.
 */
export class BaseApi {
  readonly baseUrl: string;
  readonly username: string;
  readonly password: string;
  private _ctx?: APIRequestContext;

  constructor(baseUrl: string = env.api.baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.username = env.o2.username;
    this.password = env.o2.password;
  }

  /** Get (or lazily create) the underlying APIRequestContext. */
  async context(): Promise<APIRequestContext> {
    if (!this._ctx) {
      this._ctx = await pwRequest.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          Authorization:
            'Basic ' + Buffer.from(`${this.username}:${this.password}`).toString('base64'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    }
    return this._ctx;
  }

  /** Tear down the context (call from afterAll in specs that use it). */
  async dispose(): Promise<void> {
    if (this._ctx) {
      await this._ctx.dispose();
      this._ctx = undefined;
    }
  }

  /** Build a full URL relative to baseUrl. */
  url(path: string, query?: Record<string, string | number | boolean>): string {
    const cleaned = path.startsWith('/') ? path : `/${path}`;
    if (!query) return this.baseUrl + cleaned;
    const qs = Object.entries(query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return `${this.baseUrl}${cleaned}${qs ? `?${qs}` : ''}`;
  }

  // -------------------- HTTP helpers --------------------

  async get<T>(path: string, query?: Record<string, string | number | boolean>): Promise<T> {
    const ctx = await this.context();
    const res = await ctx.get(this.url(path, query));
    log.debug(`GET ${this.url(path, query)} -> ${res.status()}`);
    if (!res.ok()) throw await this.toApiError(res, 'GET', this.url(path, query));
    return res.json();
  }

  /** GET that returns the full response (for status assertions). */
  async getRaw(
    path: string,
    query?: Record<string, string | number | boolean>,
  ): Promise<{ status: number; body: unknown }> {
    const ctx = await this.context();
    const res = await ctx.get(this.url(path, query));
    const body = await this.safeJson(res);
    return { status: res.status(), body };
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const ctx = await this.context();
    const res = await ctx.post(this.url(path), { data: body });
    log.debug(`POST ${this.url(path)} -> ${res.status()}`);
    if (!res.ok()) throw await this.toApiError(res, 'POST', this.url(path));
    return res.json();
  }

  async postReturningStatus(path: string, body: unknown): Promise<number> {
    const ctx = await this.context();
    const res = await ctx.post(this.url(path), { data: body });
    return res.status();
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const ctx = await this.context();
    const res = await ctx.put(this.url(path), { data: body });
    if (!res.ok()) throw await this.toApiError(res, 'PUT', this.url(path));
    return res.json();
  }

  async delete(path: string): Promise<number> {
    const ctx = await this.context();
    const res = await ctx.delete(this.url(path));
    return res.status();
  }

  /** OpenMRS's REST API expects a body on DELETE for void/purge operations. */
  async deleteWithBody(path: string, body: unknown): Promise<number> {
    const ctx = await this.context();
    const res = await ctx.delete(this.url(path), { data: body });
    return res.status();
  }

  private async safeJson(res: import('@playwright/test').APIResponse): Promise<unknown> {
    try {
      return await res.json();
    } catch {
      return await res.text().catch(() => '');
    }
  }

  private async toApiError(
    res: import('@playwright/test').APIResponse,
    method: string,
    url: string,
  ): Promise<Error> {
    const body = await this.safeJson(res);
    return new Error(`${method} ${url} -> HTTP ${res.status()}: ${JSON.stringify(body)}`);
  }
}
