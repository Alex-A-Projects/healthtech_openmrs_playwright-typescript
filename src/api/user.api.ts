import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiUser, ApiRole, ApiPagedResponse } from '../types/api.types';

/**
 * User API — system users, roles, privileges.
 */
export class UserApi extends BaseApi {
  /** GET /user?q=<term> - search by username or display. */
  async search(query: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPagedResponse<ApiUser>> {
    return this.get(Endpoints.user, { q: query, v });
  }

  /** GET /user/<uuid>. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiUser> {
    return this.get(`${Endpoints.user}/${uuid}`, { v });
  }

  /** POST /user - create. */
  async create(user: ApiUser): Promise<ApiUser> {
    return this.post<ApiUser>(Endpoints.user, user);
  }

  /** POST /user/<uuid> - update. */
  async update(uuid: string, user: ApiUser): Promise<ApiUser> {
    return this.post(`${Endpoints.user}/${uuid}`, user);
  }

  /** DELETE /user/<uuid>?reason=... */
  async retireUser(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.user}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }

  /** GET /role - all roles. */
  async listRoles(): Promise<ApiPagedResponse<ApiRole>> {
    return this.get<ApiPagedResponse<ApiRole>>(Endpoints.role);
  }

  /** GET /role/<uuid>. */
  async getRole(uuid: string): Promise<ApiRole> {
    return this.get<ApiRole>(`${Endpoints.role}/${uuid}`);
  }
}
