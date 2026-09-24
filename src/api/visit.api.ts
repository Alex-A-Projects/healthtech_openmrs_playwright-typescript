import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiVisit, ApiPagedResponse } from '../types/api.types';

/**
 * Visit API — patient visits (admissions / outpatient).
 */
export class VisitApi extends BaseApi {
  /** GET /visit?q=<term>&patient=<uuid>. */
  async search(opts: { q?: string; patient?: string; v?: 'default' | 'full' | 'ref'; limit?: number } = {}): Promise<ApiPagedResponse<ApiVisit>> {
    const params: Record<string, string | number | boolean> = {
      v: opts.v ?? 'full',
      limit: opts.limit ?? 20,
    };
    if (opts.q) params.q = opts.q;
    if (opts.patient) params.patient = opts.patient;
    return this.get(Endpoints.visit, params);
  }

  /** GET /visit/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiVisit> {
    return this.get(`${Endpoints.visit}/${uuid}`, { v });
  }

  /** GET /visittype - all visit types. */
  async listVisitTypes(): Promise<unknown> {
    return this.get(Endpoints.visitType);
  }

  /** GET /visittype/<uuid>. */
  async getVisitType(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.visitType}/${uuid}`);
  }

  /** POST /visit - start a visit. */
  async start(visit: ApiVisit): Promise<ApiVisit> {
    return this.post<ApiVisit>(Endpoints.visit, visit);
  }

  /** POST /visit/<uuid> - update (e.g. set stopDatetime). */
  async update(uuid: string, visit: ApiVisit): Promise<ApiVisit> {
    return this.post(`${Endpoints.visit}/${uuid}`, visit);
  }

  /** DELETE /visit/<uuid>?reason=... */
  async voidVisit(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.visit}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }
}
