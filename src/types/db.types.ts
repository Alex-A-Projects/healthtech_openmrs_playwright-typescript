/**
 * TypeScript types for the OpenMRS MySQL schema.
 *
 * These describe the rows returned from each table we touch. The schema
 * mirrors OpenMRS's "OpenMRS Reference Application" database, with some
 * fields kept loose (`string | null`) so tests don't break against minor
 * column additions in newer versions.
 */

export interface PatientRow {
  patient_id: number;
  uuid: string;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
  allergy_status: string | null;
}

export interface PersonRow {
  person_id: number;
  uuid: string;
  gender: 'M' | 'F' | 'O' | 'U' | string;
  birthdate: Date | null;
  birthdate_estimated: 0 | 1;
  dead: 0 | 1;
  death_date: Date | null;
  cause_of_death: number | null;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  creator: number;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
}

export interface PersonNameRow {
  person_name_id: number;
  person_id: number;
  prefix: string | null;
  given_name: string;
  middle_name: string | null;
  family_name_prefix: string | null;
  family_name: string;
  family_name2: string | null;
  family_name_suffix: string | null;
  degree: string | null;
  creator: number;
  date_created: Date;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
  changed_by: number | null;
  date_changed: Date | null;
  preferred: 0 | 1;
  uuid: string;
}

export interface PatientIdentifierRow {
  patient_identifier_id: number;
  patient_id: number;
  identifier: string;
  identifier_type: number;
  preferred: 0 | 1;
  location_id: number | null;
  creator: number;
  date_created: Date;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
  changed_by: number | null;
  date_changed: Date | null;
  uuid: string;
}

export interface EncounterRow {
  encounter_id: number;
  uuid: string;
  encounter_type: number;
  patient_id: number;
  visit_id: number | null;
  location_id: number | null;
  form_id: number | null;
  encounter_datetime: Date;
  creator: number;
  date_created: Date;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
  changed_by: number | null;
  date_changed: Date | null;
}

export interface EncounterProviderRow {
  encounter_provider_id: number;
  encounter_id: number;
  provider_id: number;
  encounter_role_id: number;
  creator: number;
  date_created: Date;
  voided: 0 | 1;
  date_voided: Date | null;
  voided_by: number | null;
  void_reason: string | null;
  changed_by: number | null;
  date_changed: Date | null;
}

export interface VisitRow {
  visit_id: number;
  uuid: string;
  patient_id: number;
  visit_type_id: number;
  location_id: number | null;
  date_started: Date;
  date_stopped: Date | null;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
}

export interface ObsRow {
  obs_id: number;
  uuid: string;
  person_id: number;
  concept_id: number;
  encounter_id: number | null;
  order_id: number | null;
  obs_datetime: Date;
  location_id: number | null;
  obs_group_id: number | null;
  accession_number: string | null;
  value_group_id: number | null;
  value_boolean: 0 | 1 | null;
  value_coded: number | null;
  value_coded_name_id: number | null;
  value_drug: number | null;
  value_datetime: Date | null;
  value_numeric: number | null;
  value_modifier: string | null;
  value_text: string | null;
  value_complex: string | null;
  comments: string | null;
  creator: number;
  date_created: Date;
  voided: 0 | 1;
  voided_by: number | null;
  date_voided: Date | null;
  void_reason: string | null;
  changed_by: number | null;
  date_changed: Date | null;
}

export interface ConceptRow {
  concept_id: number;
  uuid: string;
  datatype_id: number;
  class_id: number;
  is_set: 0 | 1;
  retired: 0 | 1;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  retired_by: number | null;
  date_retired: Date | null;
  retire_reason: string | null;
  version: string | null;
  short_name: string | null;
  description: string | null;
  form_text: string | null;
  datatype: string;
  class: string;
}

export interface UserRow {
  user_id: number;
  system_id: string;
  username: string;
  password: string;
  salt: string;
  secret_question: string | null;
  secret_answer: string | null;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  person_id: number | null;
  retired: 0 | 1;
  retired_by: number | null;
  date_retired: Date | null;
  retire_reason: string | null;
  uuid: string;
}

export interface LocationRow {
  location_id: number;
  uuid: string;
  name: string;
  description: string | null;
  address1: string | null;
  address2: string | null;
  city_village: string | null;
  state_province: string | null;
  country: string | null;
  postal_code: string | null;
  parent_location: number | null;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  retired: 0 | 1;
  retired_by: number | null;
  date_retired: Date | null;
  retire_reason: string | null;
}

export interface RoleRow {
  role_id: number;
  uuid: string;
  role: string;
  description: string | null;
  creator: number;
  date_created: Date;
  changed_by: number | null;
  date_changed: Date | null;
  retired: 0 | 1;
  retired_by: number | null;
  date_retired: Date | null;
  retire_reason: string | null;
}

/** Used for tests that need to verify a DB value via the API. */
export interface ApiDbBridge {
  byUuid(uuid: string): Promise<unknown>;
  byId(id: number): Promise<unknown>;
}
