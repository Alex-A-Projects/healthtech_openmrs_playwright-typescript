import { DbConnection } from './connection';
import { PersonNameRow } from '../types/db.types';

/**
 * Query helpers for the `person_name` table.
 *
 * One person can have multiple name rows; one of them is `preferred = 1`.
 */
export class PersonNameDb {
  static async byUuid(uuid: string): Promise<PersonNameRow | undefined> {
    return DbConnection.queryOne<PersonNameRow>(
      'SELECT * FROM person_name WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byPersonId(personId: number): Promise<PersonNameRow[]> {
    return DbConnection.query<PersonNameRow>(
      'SELECT * FROM person_name WHERE person_id = ?',
      [personId],
    );
  }

  /** Get the preferred name for a person (typically the only one). */
  static async preferredForPerson(personId: number): Promise<PersonNameRow | undefined> {
    return DbConnection.queryOne<PersonNameRow>(
      'SELECT * FROM person_name WHERE person_id = ? AND preferred = 1 LIMIT 1',
      [personId],
    );
  }

  /** True when a name with the given given_name exists. */
  static async existsByGivenName(given: string): Promise<boolean> {
    const row = await DbConnection.queryOne<PersonNameRow>(
      'SELECT * FROM person_name WHERE given_name = ? LIMIT 1',
      [given],
    );
    return Boolean(row);
  }

  static async byGivenAndFamily(given: string, family: string): Promise<PersonNameRow | undefined> {
    return DbConnection.queryOne<PersonNameRow>(
      'SELECT * FROM person_name WHERE given_name = ? AND family_name = ? LIMIT 1',
      [given, family],
    );
  }
}
