import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiPerson, ApiPagedResponse } from '../types/api.types';

/**
 * Person API — manages person rows (patients link back to these).
 */
export class PersonApi extends BaseApi {
  /** GET /person?q=<term> - search by name. */
  async search(query: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPagedResponse<ApiPerson>> {
    return this.get(Endpoints.person, { q: query, v });
  }

  /** GET /person/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPerson> {
    return this.get(`${Endpoints.person}/${uuid}`, { v });
  }

  /** POST /person - create a new person (no patient link). */
  async create(person: ApiPerson): Promise<ApiPerson> {
    return this.post<ApiPerson>(Endpoints.person, person);
  }

  /** POST /person/<uuid> - update. */
  async update(uuid: string, person: ApiPerson): Promise<ApiPerson> {
    return this.post(`${Endpoints.person}/${uuid}`, person);
  }

  /** DELETE /person/<uuid>?reason=... */
  async voidPerson(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.person}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }

  /** GET /person/<uuid>/name - all names for the person. */
  async getNames(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.person}/${uuid}/name`);
  }

  /** GET /person/<uuid>/address - addresses. */
  async getAddresses(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.person}/${uuid}/address`);
  }

  /** GET /person/<uuid>/attribute - attributes. */
  async getAttributes(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.person}/${uuid}/attribute`);
  }
}
