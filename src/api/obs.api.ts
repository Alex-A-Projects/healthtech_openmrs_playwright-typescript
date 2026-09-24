import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiObs, ApiPagedResponse } from '../types/api.types';

/**
 * Obs API — clinical observations (vitals, coded findings, etc).
 */
export class ObsApi extends BaseApi {
  /** GET /obs?q=<term>&patient=<uuid>&concept=<uuid>. */
  async search(opts: { q?: string; patient?: string; concept?: string; limit?: number; v?: 'default' | 'full' | 'ref' } = {}): Promise<ApiPagedResponse<ApiObs>> {
    const params: Record<string, string | number | boolean> = {
      limit: opts.limit ?? 20,
      v: opts.v ?? 'full',
    };
    if (opts.q) params.q = opts.q;
    if (opts.patient) params.patient = opts.patient;
    if (opts.concept) params.concept = opts.concept;
    return this.get(Endpoints.obs, params);
  }

  /** GET /obs/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiObs> {
    return this.get(`${Endpoints.obs}/${uuid}`, { v });
  }

  /** POST /obs - create. */
  async create(obs: ApiObs): Promise<ApiObs> {
    return this.post<ApiObs>(Endpoints.obs, obs);
  }

  /** POST /obs/<uuid> - update. */
  async update(uuid: string, obs: ApiObs): Promise<ApiObs> {
    return this.post(`${Endpoints.obs}/${uuid}`, obs);
  }

  /** DELETE /obs/<uuid>?reason=... */
  async voidObs(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.obs}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }
}
