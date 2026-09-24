/**
 * REST API endpoint catalog.
 *
 * The O2 demo's API is rooted at /openmrs/ws/rest/v1. Most collection
 * resources support `?q=<term>` for search and `?v=full` for the full
 * representation. Authentication uses HTTP Basic + the JSESSIONID cookie.
 */
export const Endpoints = {
  session: '/session',
  sessionLocation: '/sessionlocation',
  patient: '/patient',
  person: '/person',
  encounter: '/encounter',
  encounterType: '/encountertype',
  visit: '/visit',
  visitType: '/visittype',
  obs: '/obs',
  concept: '/concept',
  location: '/location',
  locationTag: '/locationtag',
  user: '/user',
  provider: '/provider',
  role: '/role',
  identifierType: '/patientidentifiertype',
  program: '/program',
  relationship: '/relationship',
  conceptSearch: '/conceptsearch',
} as const;

/** Common query strings reused across specs. */
export const Query = {
  full: 'v=full',
  default: 'v=default',
  ref: 'v=ref',
  custom: (params: Record<string, string | number | boolean>) =>
    Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&'),
} as const;
