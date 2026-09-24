import { DbConnection } from './connection';
import { ConceptRow } from '../types/db.types';

/**
 * Query helpers for the `concept` and `concept_name` tables.
 *
 * `concept` stores the row; `concept_name` stores localised names. Most
 * helpers join both so tests can search by human-readable name.
 */
export class ConceptDb {
  static async byUuid(uuid: string): Promise<ConceptRow | undefined> {
    return DbConnection.queryOne<ConceptRow>(
      `SELECT c.*, cn.name AS datatype, cs.name AS \`class\`
       FROM concept c
       JOIN concept_datatype cn ON cn.concept_datatype_id = c.datatype_id
       JOIN concept_class cs ON cs.concept_class_id = c.class_id
       WHERE c.uuid = ? LIMIT 1`,
      [uuid],
    );
  }

  static async byId(id: number): Promise<ConceptRow | undefined> {
    return DbConnection.queryOne<ConceptRow>(
      `SELECT c.*, cn.name AS datatype, cs.name AS \`class\`
       FROM concept c
       JOIN concept_datatype cn ON cn.concept_datatype_id = c.datatype_id
       JOIN concept_class cs ON cs.concept_class_id = c.class_id
       WHERE c.concept_id = ? LIMIT 1`,
      [id],
    );
  }

  static async byName(name: string): Promise<ConceptRow | undefined> {
    return DbConnection.queryOne<ConceptRow>(
      `SELECT c.*, cn.name AS datatype, cs.name AS \`class\`
       FROM concept c
       JOIN concept_name cn ON cn.concept_id = c.concept_id
       JOIN concept_datatype cd ON cd.concept_datatype_id = c.datatype_id
       JOIN concept_class cs ON cs.concept_class_id = c.class_id
       WHERE cn.name = ? LIMIT 1`,
      [name],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM concept')) ?? 0;
  }

  static async countRetired(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM concept WHERE retired = 1')) ?? 0
    );
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }

  static async existsByName(name: string): Promise<boolean> {
    const row = await this.byName(name);
    return Boolean(row);
  }

  /** List concepts of a particular datatype (numeric, coded, text, etc). */
  static async byDatatype(datatypeName: string, limit = 25): Promise<ConceptRow[]> {
    return DbConnection.query<ConceptRow>(
      `SELECT c.*, cd.name AS datatype, cs.name AS \`class\`
       FROM concept c
       JOIN concept_datatype cd ON cd.concept_datatype_id = c.datatype_id
       JOIN concept_class cs ON cs.concept_class_id = c.class_id
       WHERE cd.name = ? LIMIT ?`,
      [datatypeName, limit],
    );
  }
}
