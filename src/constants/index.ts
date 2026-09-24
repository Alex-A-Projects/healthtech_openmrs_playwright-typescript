/**
 * Shared constants used across UI, API, and DB layers.
 *
 * Identifier UIDs come from the O2 demo's "Old Identifier Number" and
 * "OpenMRS ID" identifier types. Locations and encounter types are taken
 * from the demo seed.
 */

/** Common location UUIDs on the O2 demo. */
export const LOCATION_UUIDS = {
  unknownLocation: '8d6c993e-c2cc-11de-8d13-0010c6dffd0f',
  inpatientWard: '3371a04d-49ee-4bcf-9bfc-31b91efbacb4',
  outpatientClinic: '41dbcf1b-bd11-4d59-8035-175c8e0f63b1',
  pharmacy: '7fdfa2cb-bc95-405a-88c6-45b13b1940d3',
  laboratory: '58c57d25-8c39-41ab-83cb-205cda30d382',
  registrationDesk: 'f08f7c34-3f4c-4c19-9d2d-9657c4eb0b0f',
} as const;

/** Common encounter type UUIDs on the O2 demo. */
export const ENCOUNTER_TYPE_UUIDS = {
  admission: 'ad8d4949-cc1b-4c8e-b9d5-4d6c1bc6bd27',
  cancelAdmission: 'd679c39c-b75c-4034-aa64-7d6db7ca6d04',
  codedObs: '67a71486-1a62-42f5-9c78-5e8c9fc4f0f5',
  consult: '465a92f2-baf8-42e5-b50a-e6e6f6b8a3a1',
  discharge: '9b16ec92-806d-4255-b4e0-3a1f0e1b2a35',
  emergency: '07006be3-957b-4f47-b2c8-5a8da5c69c1c',
  registration: 'c8d34b3a-8c0d-4c8e-8b3e-3f8c4f1d5b1a',
  vitals: '4d779b1d-2e0c-4c0a-9b6b-3a6b1d4f6e4d',
} as const;

/** Common visit type UUIDs. */
export const VISIT_TYPE_UUIDS = {
  clinicOrHospitalVisit: '7b0f5697-27e3-40c4-8bae-f4049ab06e25',
  homeVisit: '4c8c8a4f-7b1f-4f5b-8d8e-3f8b5b5b5b5b',
  onlineVisit: 'f4282c98-37b5-4c0e-8b6b-1a7b8e2e7e4a',
} as const;

/** Common identifier type UUIDs. */
export const IDENTIFIER_TYPE_UUIDS = {
  openmrsId: '05a29f94-c0ed-11e2-94be-8c13b969e334',
  oldIdentifierNumber: '1a339fe9-38bc-4ab2-b5c0-7c5b1e6e4a8f',
  nationalId: 'd3f4e6c2-1b3a-4c8e-9d8c-2f8e6c4b5e4a',
  passport: 'b0f7a3e4-2a4d-4b5e-9c8d-1a2b3c4d5e6f',
} as const;

/** Person attribute type UUIDs. */
export const PERSON_ATTRIBUTE_TYPE_UUIDS = {
  birthPlace: '8d8718c2-c2cc-11de-8d13-0010c6dffd0f',
  citizenship: '8d871afc-c2cc-11de-8d13-0010c6dffd0f',
  phoneNumber: '14d4f066-15f5-102d-96e4-000c29c2a5d7',
  unknown: '8d871d18-c2cc-11de-8d13-0010c6dffd0f',
} as const;

/** Concept UUIDs for common observations (O2 demo). */
export const CONCEPT_UUIDS = {
  weightKg: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1a',
  heightCm: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1b',
  temperatureC: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1c',
  systolicBloodPressure: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1d',
  diastolicBloodPressure: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1e',
  pulse: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b1f',
  bloodOxygenSaturation: 'c92a0a94-8a98-4398-b05c-8e8c8b1d5b20',
} as const;

/** Default O2 locations for the login dropdown. */
export const O2_LOCATIONS = [
  'Inpatient Ward',
  'Outpatient Clinic',
  'Pharmacy',
  'Laboratory',
  'Registration Desk',
  'Community Health Center',
  'Isolation Ward',
  'TB Clinic',
] as const;

/** Patient gender options used in registration forms and APIs. */
export const GENDERS = ['M', 'F'] as const;
export type Gender = (typeof GENDERS)[number];

/** Patient identifier sources. */
export const ID_SOURCES = {
  openmrsId: '691eed12-c0f1-11e2-94be-8c13b969e334',
} as const;
