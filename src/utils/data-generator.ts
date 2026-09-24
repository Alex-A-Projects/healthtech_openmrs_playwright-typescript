import { PatientRegistration } from '../types/ui.types';
import { ApiPatient } from '../types/api.types';
import { GENDERS } from '../constants';

/**
 * Test data generator for the OpenMRS suite.
 *
 * The O2 demo is shared with everyone on the internet, so we cannot
 * rely on any pre-existing patient. Instead, every test that needs a
 * patient generates one with a unique given/family name based on the
 * current timestamp — this avoids collisions between parallel runs
 * and makes it easy to grep the DB for what we created.
 */

let counter = 0;

function nextTag(prefix: string): string {
  counter += 1;
  return `${prefix}${Date.now()}_${counter}`;
}

/** A fresh patient registration payload with deterministic uniqueness. */
export function generatePatient(overrides: Partial<PatientRegistration> = {}): PatientRegistration {
  const tag = nextTag('QA');
  const base: PatientRegistration = {
    demographics: {
      givenName: `QAGiven${tag}`,
      familyName: `QAFamily${tag}`,
      gender: 'M',
      birthdate: '1990-01-01',
      birthdateEstimated: false,
    },
    address: {
      address1: '123 QA Street',
      city: 'Testville',
      country: 'USA',
      state: 'Test State',
      postalCode: '00000',
    },
    contact: {
      phone: '555-555-5555',
    },
    identifiers: {},
    location: 'Inpatient Ward',
  };
  return deepMerge(base, overrides);
}

/** Build the REST API body for /patient (post v1.10+ format). */
export function generateApiPatientBody(
  reg: PatientRegistration,
  identifierTypeUuid: string,
): ApiPatient {
  return {
    identifiers: [
      {
        identifier: reg.identifiers?.identifier ?? '',
        identifierType: identifierTypeUuid,
        preferred: true,
      },
    ],
    person: {
      gender: reg.demographics.gender,
      birthdate: reg.demographics.birthdate,
      birthdateEstimated: reg.demographics.birthdateEstimated ?? false,
      names: [
        {
          givenName: reg.demographics.givenName,
          middleName: reg.demographics.middleName,
          familyName: reg.demographics.familyName,
          preferred: true,
        },
      ],
      addresses: [
        {
          address1: reg.address.address1,
          address2: reg.address.address2,
          cityVillage: reg.address.city,
          stateProvince: reg.address.state,
          country: reg.address.country,
          postalCode: reg.address.postalCode,
          preferred: true,
        },
      ],
      attributes: reg.contact?.phone
        ? [
            {
              attributeType: '14d4f066-15f5-102d-96e4-000c29c2a5d7',
              value: reg.contact.phone,
            },
          ]
        : [],
    },
  };
}

/** Generate a fresh OpenMRS-style user (used for admin tests). */
export function generateUser(prefix = 'qa') {
  const tag = nextTag(prefix);
  return {
    username: `qa_user_${tag}`,
    password: 'Pa$$w0rd',
    givenName: `QA${tag}`,
    familyName: `User${tag}`,
    gender: 'M' as const,
  };
}

/** Cycle through the known genders. Useful for parameterized tests. */
export function randomGender(): (typeof GENDERS)[number] {
  return GENDERS[Math.floor(Math.random() * GENDERS.length)];
}

/** Deep merge (objects only — arrays/clobbered). */
function deepMerge<T>(base: T, overrides: Partial<T>): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(overrides as Record<string, unknown>)) {
    const cur = out[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && cur && typeof cur === 'object') {
      out[k] = deepMerge(cur, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}
