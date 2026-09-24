import { DbConnection } from './connection';
import { EncounterRow, EncounterProviderRow } from '../types/db.types';

/**
 * Query helpers for the `encounter` and `encounter_provider` tables.
 */
export class EncounterDb {
  static async byUuid(uuid: string): Promise<EncounterRow | undefined> {
    return DbConnection.queryOne<EncounterRow>(
      'SELECT * FROM encounter WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byId(id: number): Promise<EncounterRow | undefined> {
    return DbConnection.queryOne<EncounterRow>(
      'SELECT * FROM encounter WHERE encounter_id = ? LIMIT 1',
      [id],
    );
  }

  static async byPatientId(patientId: number): Promise<EncounterRow[]> {
    return DbConnection.query<EncounterRow>(
      'SELECT * FROM encounter WHERE patient_id = ? ORDER BY encounter_datetime DESC',
      [patientId],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM encounter')) ?? 0;
  }

  static async countByPatient(patientId: number): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        'SELECT COUNT(*) FROM encounter WHERE patient_id = ?',
        [patientId],
      )) ?? 0
    );
  }

  static async countByType(typeName: string): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        `SELECT COUNT(*) FROM encounter e
         JOIN encounter_type et ON et.encounter_type_id = e.encounter_type
         WHERE et.name = ?`,
        [typeName],
      )) ?? 0
    );
  }

  static async countVoided(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM encounter WHERE voided = 1')) ?? 0
    );
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }

  static async recentByPatient(patientId: number, limit = 10): Promise<EncounterRow[]> {
    return DbConnection.query<EncounterRow>(
      `SELECT * FROM encounter WHERE patient_id = ?
       ORDER BY encounter_datetime DESC LIMIT ?`,
      [patientId, limit],
    );
  }
}

export class EncounterProviderDb {
  static async byEncounterId(encounterId: number): Promise<EncounterProviderRow[]> {
    return DbConnection.query<EncounterProviderRow>(
      'SELECT * FROM encounter_provider WHERE encounter_id = ?',
      [encounterId],
    );
  }

  static async count(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM encounter_provider')) ?? 0
    );
  }
}
