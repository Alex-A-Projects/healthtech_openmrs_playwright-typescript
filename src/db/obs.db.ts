import { DbConnection } from './connection';
import { ObsRow } from '../types/db.types';

/**
 * Query helpers for the `obs` table.
 *
 * Each obs row links a person to a concept with a value (numeric, text,
 * coded, datetime, etc.) and optionally to an encounter and/or visit.
 */
export class ObsDb {
  static async byUuid(uuid: string): Promise<ObsRow | undefined> {
    return DbConnection.queryOne<ObsRow>('SELECT * FROM obs WHERE uuid = ? LIMIT 1', [uuid]);
  }

  static async byId(id: number): Promise<ObsRow | undefined> {
    return DbConnection.queryOne<ObsRow>(
      'SELECT * FROM obs WHERE obs_id = ? LIMIT 1',
      [id],
    );
  }

  static async byPersonId(personId: number, limit = 50): Promise<ObsRow[]> {
    return DbConnection.query<ObsRow>(
      'SELECT * FROM obs WHERE person_id = ? ORDER BY obs_datetime DESC LIMIT ?',
      [personId, limit],
    );
  }

  static async byEncounterId(encounterId: number): Promise<ObsRow[]> {
    return DbConnection.query<ObsRow>(
      'SELECT * FROM obs WHERE encounter_id = ? ORDER BY obs_datetime DESC',
      [encounterId],
    );
  }

  static async byConceptName(conceptName: string, limit = 25): Promise<ObsRow[]> {
    return DbConnection.query<ObsRow>(
      `SELECT o.* FROM obs o
       JOIN concept_name cn ON cn.concept_id = o.concept_id AND cn.name = ?
       ORDER BY o.obs_datetime DESC LIMIT ?`,
      [conceptName, limit],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM obs')) ?? 0;
  }

  static async countByPerson(personId: number): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        'SELECT COUNT(*) FROM obs WHERE person_id = ?',
        [personId],
      )) ?? 0
    );
  }

  static async countVoided(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM obs WHERE voided = 1')) ?? 0
    );
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }
}
