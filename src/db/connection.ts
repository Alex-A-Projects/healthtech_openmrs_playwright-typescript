import mysql from 'mysql2/promise';
import { env, dbEnvIsConfigured } from '../config/env.config';
import { log } from '../utils/logger';

/**
 * MySQL connection pool for the local OpenMRS database.
 *
 * DB tests are guarded by `dbEnvIsConfigured()` — when env vars are missing
 * (CI without a DB, for example) tests should self-skip rather than fail.
 */
export class DbConnection {
  private static _pool?: mysql.Pool;

  static get pool(): mysql.Pool {
    if (!this._pool) {
      this._pool = mysql.createPool({
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        waitForConnections: true,
        connectionLimit: 8,
        queueLimit: 0,
        dateStrings: true,
      });
    }
    return this._pool;
  }

  static isConfigured(): boolean {
    return dbEnvIsConfigured();
  }

  /** Execute a parameterised query and return rows. */
  static async query<T = Record<string, unknown>>(
    sql: string,
    params: readonly any[] = [],
  ): Promise<T[]> {
    const [rows] = await this.pool.execute(sql, params as any[]);
    return rows as T[];
  }

  /** Execute a parameterised query and return the first row (or undefined). */
  static async queryOne<T = Record<string, unknown>>(
    sql: string,
    params: readonly any[] = [],
  ): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  /** Run a parameterised UPDATE / INSERT / DELETE and return affected rows. */
  static async execute(sql: string, params: readonly any[] = []): Promise<number> {
    const [result] = await this.pool.execute(sql, params as any[]);
    return (result as mysql.ResultSetHeader).affectedRows ?? 0;
  }

  /** Run an INSERT and return the inserted primary key. */
  static async insert(sql: string, params: readonly any[] = []): Promise<number> {
    const [result] = await this.pool.execute(sql, params as any[]);
    return (result as mysql.ResultSetHeader).insertId;
  }

  /** Return a single scalar value (COUNT, MAX, etc). */
  static async scalar<T = number | string | null>(
    sql: string,
    params: readonly any[] = [],
  ): Promise<T | undefined> {
    const row = await this.queryOne<Record<string, T>>(sql, params);
    return row ? Object.values(row)[0] : undefined;
  }

  /** Throw a clear error when DB is not configured. */
  static guard(): void {
    if (!this.isConfigured()) {
      throw new Error(
        'Database env vars are not configured. Set DB_HOST, DB_USER, DB_NAME ' +
          '(and DB_PASSWORD, DB_PORT) in .env, or skip DB tests.',
      );
    }
  }

  /** Best-effort graceful close. */
  static async close(): Promise<void> {
    if (this._pool) {
      try {
        await this._pool.end();
      } catch (err) {
        log.warn(`[db] Error closing pool: ${(err as Error).message}`);
      }
      this._pool = undefined;
    }
  }
}
