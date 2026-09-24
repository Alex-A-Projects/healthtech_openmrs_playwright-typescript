import { DbConnection } from './connection';
import { PatientRow } from '../types/db.types';

/**
 * Query helpers for the `patient` table.
 *
 * OpenMRS schema note: the `patient` table does NOT have its own UUID
 * column — a patient's UUID lives on the `person` row it joins to
 * (`patient.patient_id = person.person_id`). All helpers that take a
 * UUID join through `person` to find the matching patient row.
 */
export class PatientDb {
  /** Lookup by the patient's UUID (joins to person table). */
  static async byUuid(uuid: string): Promise<PatientRow | undefined> {
    return DbConnection.queryOne<PatientRow>(
      `SELECT pa.* FROM patient pa
       JOIN person pe ON pe.person_id = pa.patient_id
       WHERE pe.uuid = ? LIMIT 1`,
      [uuid],
    );
  }

  /** Lookup by primary key. */
  static async byId(patientId: number): Promise<PatientRow | undefined> {
    return DbConnection.queryOne<PatientRow>(
      'SELECT * FROM patient WHERE patient_id = ? LIMIT 1',
      [patientId],
    );
  }

  /** Total number of patients. */
  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient')) ?? 0;
  }

  /** Count non-voided patients. */
  static async activeCount(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient WHERE voided = 0')) ?? 0;
  }

  /** Count voided patients. */
  static async voidedCount(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM patient WHERE voided = 1')) ?? 0;
  }

  /** Find the most recently created patients. */
  static async recent(limit = 10): Promise<PatientRow[]> {
    return DbConnection.query<PatientRow>(
      'SELECT * FROM patient ORDER BY date_created DESC LIMIT ?',
      [limit],
    );
  }

  /** True when a patient with the given UUID exists (via person join). */
  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await DbConnection.queryOne<{ uuid: string }>(
      `SELECT pe.uuid FROM person pe
       JOIN patient pa ON pa.patient_id = pe.person_id
       WHERE pe.uuid = ? LIMIT 1`,
      [uuid],
    );
    return Boolean(row);
  }

  /** True when the patient row is voided. */
  static async isVoided(uuid: string): Promise<boolean> {
    const row = await DbConnection.queryOne<{ voided: 0 | 1 }>(
      `SELECT pa.voided FROM patient pa
       JOIN person pe ON pe.person_id = pa.patient_id
       WHERE pe.uuid = ? LIMIT 1`,
      [uuid],
    );
    return row?.voided === 1;
  }

  /** SELECT by partial UUID prefix (joins to person; useful when fuzzy-matching). */
  static async byUuidPrefix(prefix: string, limit = 5): Promise<PatientRow[]> {
    return DbConnection.query<PatientRow>(
      `SELECT pa.* FROM patient pa
       JOIN person pe ON pe.person_id = pa.patient_id
       WHERE pe.uuid LIKE ?
       LIMIT ?`,
      [`${prefix}%`, limit],
    );
  }

  /** Count patients created after a given date. */
  static async countCreatedAfter(date: Date): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        'SELECT COUNT(*) FROM patient WHERE date_created > ?',
        [date],
      )) ?? 0
    );
  }
}
