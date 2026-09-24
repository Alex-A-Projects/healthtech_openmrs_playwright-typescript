import { DbConnection } from './connection';
import { VisitRow } from '../types/db.types';

/**
 * Query helpers for the `visit` table.
 */
export class VisitDb {
  static async byUuid(uuid: string): Promise<VisitRow | undefined> {
    return DbConnection.queryOne<VisitRow>(
      'SELECT * FROM visit WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byId(id: number): Promise<VisitRow | undefined> {
    return DbConnection.queryOne<VisitRow>(
      'SELECT * FROM visit WHERE visit_id = ? LIMIT 1',
      [id],
    );
  }

  static async byPatientId(patientId: number): Promise<VisitRow[]> {
    return DbConnection.query<VisitRow>(
      'SELECT * FROM visit WHERE patient_id = ? ORDER BY date_started DESC',
      [patientId],
    );
  }

  static async activeByPatient(patientId: number): Promise<VisitRow[]> {
    return DbConnection.query<VisitRow>(
      'SELECT * FROM visit WHERE patient_id = ? AND date_stopped IS NULL AND voided = 0',
      [patientId],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM visit')) ?? 0;
  }

  static async countByPatient(patientId: number): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        'SELECT COUNT(*) FROM visit WHERE patient_id = ?',
        [patientId],
      )) ?? 0
    );
  }

  static async countActive(): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        'SELECT COUNT(*) FROM visit WHERE date_stopped IS NULL AND voided = 0',
      )) ?? 0
    );
  }

  static async countVoided(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM visit WHERE voided = 1')) ?? 0
    );
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }
}
