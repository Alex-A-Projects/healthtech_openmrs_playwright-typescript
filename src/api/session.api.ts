import { BaseApi } from './base.api';
import { ApiSession, ApiPagedResponse, ApiResourceRef } from '../types/api.types';
import { Endpoints } from '../config/endpoints.config';

/**
 * Session API — login, logout, and session location management.
 *
 * OpenMRS uses both HTTP Basic auth and JSESSIONID cookies. The /session
 * endpoint returns the authenticated user's profile and privileges.
 */
export class SessionApi extends BaseApi {
  /** GET the current session. */
  async current(): Promise<ApiSession> {
    return this.get<ApiSession>(Endpoints.session);
  }

  /** Returns true when the credentials produce an authenticated session. */
  async isAuthenticated(): Promise<boolean> {
    const s = await this.current().catch(() => ({ authenticated: false } as ApiSession));
    return Boolean(s?.authenticated);
  }

  /** List available locations for login (used by the location dropdown). */
  async listLocations(): Promise<ApiPagedResponse<ApiResourceRef>> {
    return this.get<ApiPagedResponse<ApiResourceRef>>(Endpoints.location, {
      limit: 100,
    });
  }

  /** GET /sessionlocation - the location associated with the active session. */
  async currentLocation(): Promise<{ uuid?: string; display?: string }> {
    return (await this.get(Endpoints.sessionLocation).catch(() => ({}))) as {
      uuid?: string;
      display?: string;
    };
  }

  /** Convenience: returns true if a `Location:` header sets a known location. */
  async hasLocation(): Promise<boolean> {
    const loc = await this.currentLocation();
    return Boolean(loc?.uuid);
  }
}
