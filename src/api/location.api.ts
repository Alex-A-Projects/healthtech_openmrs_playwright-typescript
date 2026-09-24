import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiLocation, ApiPagedResponse } from '../types/api.types';

/**
 * Location API — facilities, departments, wards.
 */
export class LocationApi extends BaseApi {
  /** GET /location?q=<term>. */
  async search(query: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPagedResponse<ApiLocation>> {
    return this.get(Endpoints.location, { q: query, v });
  }

  /** GET /location?tag=<uuid> - filter by location tag. */
  async byTag(tagUuid: string): Promise<unknown> {
    return this.get(Endpoints.location, { tag: tagUuid });
  }

  /** GET /location/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiLocation> {
    return this.get(`${Endpoints.location}/${uuid}`, { v });
  }

  /** POST /location - create. */
  async create(loc: ApiLocation): Promise<ApiLocation> {
    return this.post<ApiLocation>(Endpoints.location, loc);
  }

  /** POST /location/<uuid> - update. */
  async update(uuid: string, loc: ApiLocation): Promise<ApiLocation> {
    return this.post(`${Endpoints.location}/${uuid}`, loc);
  }

  /** DELETE /location/<uuid>?reason=... */
  async retireLocation(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.location}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }

  /** GET /locationtag - list location tags. */
  async listTags(): Promise<unknown> {
    return this.get(Endpoints.locationTag);
  }
}
