/**
 * Shared TypeScript types for the OpenMRS REST API.
 *
 * These mirror the JSON shapes returned by /ws/rest/v1/. The default
 * representation is `v=default` (UUIDs only); `v=full` adds names and
 * audit fields.
 */

export interface ApiResourceRef {
  uuid: string;
  display?: string;
}

export interface ApiAuditInfo {
  creator?: ApiResourceRef;
  dateCreated?: string;
  changedBy?: ApiResourceRef;
  dateChanged?: string;
  retired?: boolean;
  retireReason?: string;
  retiredBy?: ApiResourceRef;
  dateRetired?: string;
}

export interface ApiLink {
  rel: string;
  uri: string;
  resourceAlias?: string;
}

export interface ApiSession {
  authenticated: boolean;
  user?: ApiResourceRef;
  sessionId?: string;
  privileges?: ApiResourceRef[];
  roles?: ApiResourceRef[];
  currentLocation?: ApiResourceRef;
}

export interface ApiPersonName {
  uuid?: string;
  givenName: string;
  middleName?: string;
  familyName: string;
  preferred?: boolean;
  prefix?: string;
  familyName2?: string;
  voided?: boolean;
}

export interface ApiPersonAddress {
  uuid?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  preferred?: boolean;
}

export interface ApiAttribute {
  attributeType: string; // UUID
  value: string | number | boolean;
  voided?: boolean;
  uuid?: string;
}

export interface ApiIdentifier {
  uuid?: string;
  identifier: string;
  identifierType: string; // UUID
  location?: string; // UUID
  preferred?: boolean;
  voided?: boolean;
}

export interface ApiPerson {
  uuid?: string;
  display?: string;
  gender: 'M' | 'F' | 'O' | 'U';
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string;
  causeOfDeath?: string;
  names: ApiPersonName[];
  addresses?: ApiPersonAddress[];
  attributes?: ApiAttribute[];
  voided?: boolean;
  deathdateEstimated?: boolean;
}

export interface ApiPatient {
  uuid?: string;
  display?: string;
  identifiers: ApiIdentifier[];
  person: ApiPerson;
  voided?: boolean;
}

export interface ApiEncounter {
  uuid?: string;
  display?: string;
  encounterDatetime: string;
  patient: string; // UUID
  encounterType: string; // UUID
  location?: string; // UUID
  form?: string; // UUID
  encounterProviders?: { provider: string; encounterRole: string }[];
  obs?: { concept: string; value: string | number }[];
  visit?: string; // UUID
  voided?: boolean;
}

export interface ApiVisit {
  uuid?: string;
  display?: string;
  patient: string; // UUID
  visitType: string; // UUID
  startDatetime: string;
  stopDatetime?: string;
  location?: string; // UUID
  voided?: boolean;
}

export interface ApiObs {
  uuid?: string;
  display?: string;
  concept: string; // UUID
  encounter?: string; // UUID
  person: string; // UUID
  obsDatetime: string;
  value?: string | number | boolean;
  groupMembers?: ApiObs[];
  voided?: boolean;
  comment?: string;
  location?: string; // UUID
}

export interface ApiLocation {
  uuid?: string;
  display?: string;
  name: string;
  description?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  parentLocation?: string; // UUID
  tags?: { uuid: string; display?: string }[];
  retired?: boolean;
}

export interface ApiUser {
  uuid?: string;
  display?: string;
  username: string;
  password?: string;
  person?: ApiResourceRef;
  roles?: { uuid?: string; display?: string; name?: string }[];
  retired?: boolean;
  systemId?: string;
  email?: string;
}

export interface ApiRole {
  uuid?: string;
  display?: string;
  name: string;
  description?: string;
  privileges?: ApiResourceRef[];
}

export interface ApiConcept {
  uuid?: string;
  display?: string;
  name?: { display?: string; uuid?: string; name?: string };
  names?: { display?: string; uuid?: string; name?: string }[];
  datatype?: { uuid?: string; display?: string };
  conceptClass?: { uuid?: string; display?: string };
  units?: string;
  retired?: boolean;
}

export interface ApiPagedResponse<T> {
  results: T[];
  totalCount?: number;
  pageSize?: number;
  pageNumber?: number;
  links?: ApiLink[];
  error?: { message: string; code?: string; detail?: string };
}
