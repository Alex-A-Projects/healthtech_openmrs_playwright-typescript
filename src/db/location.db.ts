import { DbConnection } from './connection';
import { LocationRow } from '../types/db.types';

/**
 * Query helpers for the `location` table.
 */
export class LocationDb {
  static async byUuid(uuid: string): Promise<LocationRow | undefined> {
    return DbConnection.queryOne<LocationRow>(
      'SELECT * FROM location WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byName(name: string): Promise<LocationRow | undefined> {
    return DbConnection.queryOne<LocationRow>(
      'SELECT * FROM location WHERE name = ? LIMIT 1',
      [name],
    );
  }

  static async byId(id: number): Promise<LocationRow | undefined> {
    return DbConnection.queryOne<LocationRow>(
      'SELECT * FROM location WHERE location_id = ? LIMIT 1',
      [id],
    );
  }

  static async list(): Promise<LocationRow[]> {
    return DbConnection.query<LocationRow>(
      'SELECT * FROM location ORDER BY name',
    );
  }

  static async count(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM location')) ?? 0
    );
  }

  static async countRetired(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM location WHERE retired = 1')) ?? 0
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

  static async listNonRetired(): Promise<LocationRow[]> {
    return DbConnection.query<LocationRow>(
      'SELECT * FROM location WHERE retired = 0 ORDER BY name',
    );
  }
}
