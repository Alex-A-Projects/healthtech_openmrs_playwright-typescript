import { DbConnection } from './connection';
import { PatientIdentifierRow } from '../types/db.types';

/**
 * Query helpers for the `patient_identifier` table.
 *
 * A patient can carry many identifiers — e.g. OpenMRS ID, Old Identifier
 * Number, National ID. Identifier type is a foreign key to
 * `patient_identifier_type`.
 */
export class PatientIdentifierDb {
  static async byUuid(uuid: string): Promise<PatientIdentifierRow | undefined> {
    return DbConnection.queryOne<PatientIdentifierRow>(
      'SELECT * FROM patient_identifier WHERE uuid = ? LIMIT 1',
      [uuid],
    );
  }

  static async byIdentifier(identifier: string): Promise<PatientIdentifierRow | undefined> {
    return DbConnection.queryOne<PatientIdentifierRow>(
      'SELECT * FROM patient_identifier WHERE identifier = ? LIMIT 1',
      [identifier],
    );
  }

  static async byPatientId(patientId: number): Promise<PatientIdentifierRow[]> {
    return DbConnection.query<PatientIdentifierRow>(
      'SELECT * FROM patient_identifier WHERE patient_id = ?',
      [patientId],
    );
  }

  static async preferredForPatient(patientId: number): Promise<PatientIdentifierRow | undefined> {
    return DbConnection.queryOne<PatientIdentifierRow>(
      'SELECT * FROM patient_identifier WHERE patient_id = ? AND preferred = 1 LIMIT 1',
      [patientId],
    );
  }

  /** Count by identifier type (joins to the type lookup). */
  static async countByType(typeName: string): Promise<number> {
    return (
      (await DbConnection.scalar<number>(
        `SELECT COUNT(*) FROM patient_identifier pi
         JOIN patient_identifier_type pit ON pit.patient_identifier_type_id = pi.identifier_type
         WHERE pit.name = ?`,
        [typeName],
      )) ?? 0
    );
  }

  static async existsByIdentifier(identifier: string): Promise<boolean> {
    const row = await this.byIdentifier(identifier);
    return Boolean(row);
  }
}
