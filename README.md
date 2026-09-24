# OpenMRS Automation Suite

Playwright + TypeScript framework for OpenMRS — UI (POM), REST API, and MySQL DB tests.

## Quick start

```bash
npm install
cp .env.local.example .env       # points at local OpenMRS Docker
npm run start:openmrs            # boots MySQL + OpenMRS, waits until ready (~2 min)
npm test                         # full suite
```

For the public `o2.openmrs.org` demo, copy `cf_clearance` from your browser into `CF_CLEARANCE` in `.env` and switch `O2_BASE_URL` to `https://o2.openmrs.org/openmrs`.

## Test counts

| Layer | Tests | Files |
| --- | --- | --- |
| UI  | 254 | 17 |
| API | 136 | 14 |
| DB  | 111 | 12 |
| **Total** | **501** | 43 |

## What actually runs

The Docker image `openmrs-reference-application-distro:2.10.0` is missing some view mappings, so the following admin pages return `<h1>UI Framework Error</h1>` instead of real content:

- `/adminui/systemadministration/systemAdministration.page`
- `/adminui/metadata/configureMetaData.page`
- `/adminui/customize/customize.page`
- `/coreapps/findpatient/findPatient.page`
- `/coreapps/activeVisits/activeVisits.page`
- `/coreapps/clinicianfacing/patient.page`
- `/vitals/patient.page`
- `/datamanagement/home.page`
- `/datamanagement/mergePatients.page`
- `/registrationapp/registerPatient.page`

The POMs detect this with `isBrokenPage()` and call `testInfo.skip()` — tests show as **yellow skipped** in Test Explorer, not red failures.

**Currently against local Docker:** ~50 pass, ~165 skip, 0 fail.  
**Against the public O2 demo:** all tests pass.

## Project layout

```
src/
├── api/        REST API clients (patient, person, encounter, visit, obs, ...)
├── pages/      Page Object Models
├── db/         MySQL query helpers
├── config/     env + REST endpoint catalog
├── constants/  UUIDs, locations, encounter types
├── types/      TypeScript shapes for API / DB / UI
└── utils/      helpers, logger, data generator

tests/
├── ui/         Playwright UI specs (17 files)
├── api/        Playwright `request` specs against /ws/rest/v1 (14 files)
└── db/         mysql2 specs (12 files)

fixtures/testFixtures.ts   custom fixtures (login, every POM, apiContext)
global-setup.ts            probes O2 before the suite starts
docker-compose.yml         local OpenMRS stack
playwright.config.ts       workers=1, single chromium project
scripts/wait-for-openmrs.sh   polls until OpenMRS is ready
```

## npm scripts

```bash
npm test                       # full suite
npm run test:ui                # UI specs only
npm run test:api               # API specs only
npm run test:db                # DB specs only
npm run test:headed            # headed debug
npm run test:debug             # step-through debug
npm run test:list              # list every test
npm run test:report            # open last HTML report
npm run codegen                # generate locators by clicking O2
npm run lint                   # tsc --noEmit
npm run start:openmrs           # docker compose up + wait until ready
npm run stop:openmrs            # docker compose down
npm run logs:openmrs            # docker compose logs -f openmrs
npm run reset:openmrs           # destroy data volume, fresh start
```

## Environment variables

```env
# OpenMRS target — either public O2 demo or local Docker
O2_BASE_URL=http://localhost:8088/openmrs                # Docker
# O2_BASE_URL=https://o2.openmrs.org/openmrs             # public demo

O2_USERNAME=admin
O2_PASSWORD=Admin123
O2_LOCATION=Inpatient Ward

API_BASE_URL=http://localhost:8088/openmrs/ws/rest/v1/
API_SESSION_CACHE=./.api-session.json

# MySQL — used by DB tests; points at the Docker's exposed port
DB_HOST=localhost
DB_PORT=3306
DB_USER=openmrs
DB_PASSWORD=openmrs
DB_NAME=openmrs
DB_SKIP_IF_MISSING=false

# Tuning
ACTION_DELAY_MS=30
LOG_LEVEL=info
SKIP_GLOBAL_SETUP=true        # skip the O2 health probe (faster)

# Cloudflare cookie — only needed when running against the public O2 demo
CF_CLEARANCE=
CF_BM=
```

## Demo credentials

```
URL:      http://localhost:8088/openmrs (Docker) or https://o2.openmrs.org/openmrs (public)
Username: admin
Password: Admin123
Location: Inpatient Ward
```
