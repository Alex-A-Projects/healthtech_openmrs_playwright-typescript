import { DbConnection } from './connection';
import { PersonRow } from '../types/db.types';

/**
 * Query helpers for the `person` table.
 *
 * Every patient row joins to a person row via person_id. The person table
 * stores demographic fields (gender, birthdate, dead, etc).
 */
export class PersonDb {
  static async byUuid(uuid: string): Promise<PersonRow | undefined> {
    return DbConnection.queryOne<PersonRow>(
      'SELECT * FROM person WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byId(personId: number): Promise<PersonRow | undefined> {
    return DbConnection.queryOne<PersonRow>(
      'SELECT * FROM person WHERE person_id = ? LIMIT 1',
      [personId],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM person')) ?? 0;
  }

  static async countByGender(gender: string): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM person WHERE gender = ?', [
        gender,
      ])) ?? 0
    );
  }

  static async countDead(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM person WHERE dead = 1')) ?? 0;
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }

  static async byGenderAndBirthdate(gender: string, birthdate: string): Promise<PersonRow[]> {
    return DbConnection.query<PersonRow>(
      'SELECT * FROM person WHERE gender = ? AND birthdate = ?',
      [gender, birthdate],
    );
  }
}
