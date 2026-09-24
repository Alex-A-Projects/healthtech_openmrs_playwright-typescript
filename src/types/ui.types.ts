/**
 * TypeScript types for UI form payloads and page state.
 *
 * These describe the data we feed into the registration, visit, and
 * encounter forms — they're slightly looser than the API payloads
 * because the UI accepts more free-form input.
 */

export interface LoginCredentials {
  username: string;
  password: string;
  location: string;
}

export interface AddressInfo {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface NameInfo {
  givenName: string;
  middleName?: string;
  familyName: string;
  prefix?: string;
}

export interface PatientRegistration {
  demographics: {
    givenName: string;
    middleName?: string;
    familyName: string;
    gender: 'M' | 'F' | 'O' | 'U';
    birthdate: string;
    birthdateEstimated?: boolean;
  };
  address: AddressInfo;
  contact?: {
    phone?: string;
    email?: string;
  };
  identifiers?: {
    identifier?: string; // optional - auto-generated OpenMRS ID
  };
  location?: string; // defaults to current session location
}

export interface VitalsCapture {
  weight?: number;
  height?: number;
  temperature?: number;
  systolicBloodPressure?: number;
  diastolicBloodPressure?: number;
  pulse?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
}

export interface VisitForm {
  patientUuid: string;
  visitType: string;
  location?: string;
  startDatetime?: string;
  stopDatetime?: string;
}

export interface EncounterForm {
  patientUuid: string;
  encounterType: string;
  encounterDatetime?: string;
  location?: string;
  providers?: { provider: string; encounterRole: string }[];
  obs?: { concept: string; value: string | number }[];
  visitUuid?: string;
  form?: string;
}
