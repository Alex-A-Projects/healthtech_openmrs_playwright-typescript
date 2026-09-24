import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiConcept, ApiPagedResponse } from '../types/api.types';

/**
 * Concept API — dictionary entries for diagnoses, vitals, etc.
 */
export class ConceptApi extends BaseApi {
  /** GET /concept?q=<term>. */
  async search(query: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPagedResponse<ApiConcept>> {
    return this.get(Endpoints.concept, { q: query, v });
  }

  /** GET /conceptsearch?q=<term> - the legacy / dedicated search endpoint. */
  async conceptSearch(query: string): Promise<unknown> {
    return this.get(Endpoints.conceptSearch, { q: query });
  }

  /** GET /concept/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiConcept> {
    return this.get(`${Endpoints.concept}/${uuid}`, { v });
  }

  /** POST /concept - create a new concept. */
  async create(concept: ApiConcept): Promise<ApiConcept> {
    return this.post<ApiConcept>(Endpoints.concept, concept);
  }

  /** POST /concept/<uuid> - update. */
  async update(uuid: string, concept: ApiConcept): Promise<ApiConcept> {
    return this.post(`${Endpoints.concept}/${uuid}`, concept);
  }

  /** DELETE /concept/<uuid>?reason=... */
  async retire(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.concept}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }
}
