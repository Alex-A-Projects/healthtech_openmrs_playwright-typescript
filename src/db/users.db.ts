import { DbConnection } from './connection';
import { UserRow } from '../types/db.types';

/**
 * Query helpers for the `users` table.
 *
 * Note: the table is named `users` (plural) — important for SQL syntax.
 */
export class UsersDb {
  static async byUuid(uuid: string): Promise<UserRow | undefined> {
    return DbConnection.queryOne<UserRow>(
      'SELECT * FROM users WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byUsername(username: string): Promise<UserRow | undefined> {
    return DbConnection.queryOne<UserRow>(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username],
    );
  }

  static async bySystemId(systemId: string): Promise<UserRow | undefined> {
    return DbConnection.queryOne<UserRow>(
      'SELECT * FROM users WHERE system_id = ? LIMIT 1',
      [systemId],
    );
  }

  static async count(): Promise<number> {
    return (await DbConnection.scalar<number>('SELECT COUNT(*) FROM users')) ?? 0;
  }

  static async countRetired(): Promise<number> {
    return (
      (await DbConnection.scalar<number>('SELECT COUNT(*) FROM users WHERE retired = 1')) ?? 0
    );
  }

  static async existsByUsername(username: string): Promise<boolean> {
    const row = await this.byUsername(username);
    return Boolean(row);
  }

  static async existsByUuid(uuid: string): Promise<boolean> {
    const row = await this.byUuid(uuid);
    return Boolean(row);
  }

  static async hasRole(username: string, roleName: string): Promise<boolean> {
    const count = await DbConnection.scalar<number>(
      `SELECT COUNT(*) FROM users u
       JOIN user_role ur ON ur.user_id = u.user_id
       JOIN role r ON r.role = ur.role
       WHERE u.username = ? AND r.role = ?`,
      [username, roleName],
    );
    return (count ?? 0) > 0;
  }

  static async countByRole(roleName: string): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        `SELECT COUNT(*) FROM users u
         JOIN user_role ur ON ur.user_id = u.user_id
         JOIN role r ON r.role = ur.role
         WHERE r.role = ?`,
        [roleName],
      )) ?? 0
    );
  }
}
