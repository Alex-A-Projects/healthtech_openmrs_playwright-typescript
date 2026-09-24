import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiEncounter, ApiPagedResponse } from '../types/api.types';

/**
 * Encounter API — clinical visits / events.
 */
export class EncounterApi extends BaseApi {
  /** GET /encounter?q=<term>&patient=<uuid> - search encounters. */
  async search(opts: { q?: string; patient?: string; v?: 'default' | 'full' | 'ref'; limit?: number } = {}): Promise<ApiPagedResponse<ApiEncounter>> {
    const params: Record<string, string | number | boolean> = {
      v: opts.v ?? 'full',
      limit: opts.limit ?? 20,
    };
    if (opts.q) params.q = opts.q;
    if (opts.patient) params.patient = opts.patient;
    return this.get(Endpoints.encounter, params);
  }

  /** GET /encounter/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiEncounter> {
    return this.get(`${Endpoints.encounter}/${uuid}`, { v });
  }

  /** POST /encounter - create an encounter. */
  async create(encounter: ApiEncounter): Promise<ApiEncounter> {
    return this.post<ApiEncounter>(Endpoints.encounter, encounter);
  }

  /** POST /encounter/<uuid> - update. */
  async update(uuid: string, encounter: ApiEncounter): Promise<ApiEncounter> {
    return this.post(`${Endpoints.encounter}/${uuid}`, encounter);
  }

  /** DELETE /encounter/<uuid>?reason=... */
  async voidEncounter(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.encounter}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }

  /** GET /encountertype - all encounter types. */
  async listEncounterTypes(): Promise<unknown> {
    return this.get(Endpoints.encounterType);
  }

  /** GET /encountertype/<uuid>. */
  async getEncounterType(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.encounterType}/${uuid}`);
  }
}
