import { BaseApi } from './base.api';
import { Endpoints } from '../config/endpoints.config';
import { ApiPatient, ApiPagedResponse } from '../types/api.types';
import { generateApiPatientBody } from '../utils/data-generator';
import { PatientRegistration } from '../types/ui.types';

/**
 * Patient API — full CRUD plus search.
 *
 * The default representation (v=default) returns just identifiers + person
 * UUIDs. Pass `v=full` (or `?v=full`) for the expanded payload.
 */
export class PatientApi extends BaseApi {
  /** GET /patient?q=<term> - search by identifier, name, or UUID fragment. */
  async search(query: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPagedResponse<ApiPatient>> {
    return this.get(Endpoints.patient, { q: query, v });
  }

  /** GET /patient - paginated list of patients. */
  async list(opts: { limit?: number; startIndex?: number; v?: 'default' | 'full' | 'ref' } = {}): Promise<ApiPagedResponse<ApiPatient>> {
    return this.get(Endpoints.patient, {
      limit: opts.limit ?? 20,
      startIndex: opts.startIndex ?? 0,
      v: opts.v ?? 'full',
    });
  }

  /** GET /patient/<uuid> - fetch a single patient by UUID. */
  async getByUuid(uuid: string, v: 'default' | 'full' | 'ref' = 'full'): Promise<ApiPatient> {
    return this.get(`${Endpoints.patient}/${uuid}`, { v });
  }

  /** POST /patient - create a new patient. */
  async create(reg: PatientRegistration, identifierTypeUuid: string): Promise<ApiPatient> {
    const body = generateApiPatientBody(reg, identifierTypeUuid);
    return this.post<ApiPatient>(Endpoints.patient, body);
  }

  /** POST a raw patient body (used when callers need the full OpenMRS format). */
  async createRaw(body: ApiPatient): Promise<ApiPatient> {
    return this.post<ApiPatient>(Endpoints.patient, body);
  }

  /** POST /patient/<uuid> - update a patient. OpenMRS treats POST-as-update too. */
  async update(uuid: string, body: ApiPatient): Promise<ApiPatient> {
    return this.post(`${Endpoints.patient}/${uuid}`, body);
  }

  /** DELETE /patient/<uuid>?reason=... - void a patient (the row stays, voided=1). */
  async voidPatient(uuid: string, reason: string): Promise<number> {
    return this.delete(`${Endpoints.patient}/${uuid}?reason=${encodeURIComponent(reason)}`);
  }

  /** DELETE /patient/<uuid>?purge=true - hard-delete the patient row. */
  async purge(uuid: string, reason: string): Promise<number> {
    return this.delete(
      `${Endpoints.patient}/${uuid}?purge=true&reason=${encodeURIComponent(reason)}`,
    );
  }

  /** GET /patient/<uuid>/identifiers - all identifiers for a patient. */
  async getIdentifiers(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.patient}/${uuid}/identifiers`);
  }

  /** GET /patient/<uuid>/visit - visits associated with a patient. */
  async getVisits(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.patient}/${uuid}/visit`);
  }

  /** GET /patient/<uuid>/encounter - encounters associated with a patient. */
  async getEncounters(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.patient}/${uuid}/encounter`);
  }

  /** GET /patient/<uuid>/programEnrollment - active program enrollments. */
  async getProgramEnrollments(uuid: string): Promise<unknown> {
    return this.get(`${Endpoints.patient}/${uuid}/programEnrollment`);
  }
}
