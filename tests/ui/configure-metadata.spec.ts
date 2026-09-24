import { test, expect } from '../../fixtures/testFixtures';

/**
 * tests/ui/configure-metadata.spec.ts
 *
 * UI tests for the "Configure Metadata" landing screen and all sub-pages.
 *
 * Sections:
 *   Concepts        → Manage Concept Dictionary
 *   Encounters      → Manage Encounter Roles, Manage Encounter Types
 *   Forms           → Manage Forms
 *   Locations       → Manage Location Attribute Types, Manage Location Tags, Manage Locations
 *   Metadata Mappings → Manage Mappings
 *   Open Concept Lab → Manage OCL
 *   Patients        → Manage Patient Identifier Types
 *   Providers       → Manage Provider Attribute Types
 *   Roles And Privileges → Manage Privileges, Manage Roles
 *   Visits          → Manage Visit Types
 */
test.describe('Configure Metadata', () => {
  // ---------- Section visibility ----------

  test('the Configure Metadata page shows its heading', async ({ configureMetadataPage }) => {
    await configureMetadataPage.waitForReady();
    await expect(configureMetadataPage.heading).toBeVisible();
  });

  test('the Concepts section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isConceptSectionVisible()).toBeTruthy();
  });

  test('the Encounters section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isEncountersSectionVisible()).toBeTruthy();
  });

  test('the Forms section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isFormsSectionVisible()).toBeTruthy();
  });

  test('the Locations section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isLocationsSectionVisible()).toBeTruthy();
  });

  test('the Metadata Mappings section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isMetadataMappingsSectionVisible()).toBeTruthy();
  });

  test('the Open Concept Lab section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isOpenConceptLabSectionVisible()).toBeTruthy();
  });

  test('the Patients section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isPatientsSectionVisible()).toBeTruthy();
  });

  test('the Providers section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isProvidersSectionVisible()).toBeTruthy();
  });

  test('the Roles And Privileges section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isRolesAndPrivilegesSectionVisible()).toBeTruthy();
  });

  test('the Visits section is visible', async ({ configureMetadataPage }) => {
    expect(await configureMetadataPage.isVisitsSectionVisible()).toBeTruthy();
  });

  // ---------- Each link exists ----------

  test('Manage Concept Dictionary link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageConceptDictionaryLink).toBeVisible();
  });
  test('Manage Encounter Roles link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageEncounterRolesLink).toBeVisible();
  });
  test('Manage Encounter Types link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageEncounterTypesLink).toBeVisible();
  });
  test('Manage Forms link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageFormsLink).toBeVisible();
  });
  test('Manage Location Attribute Types link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageLocationAttributeTypesLink).toBeVisible();
  });
  test('Manage Location Tags link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageLocationTagsLink).toBeVisible();
  });
  test('Manage Locations link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageLocationsLink).toBeVisible();
  });
  test('Manage Mappings link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageMappingsLink).toBeVisible();
  });
  test('Manage OCL link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageOCLLink).toBeVisible();
  });
  test('Manage Patient Identifier Types link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.managePatientIdentifierTypesLink).toBeVisible();
  });
  test('Manage Provider Attribute Types link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageProviderAttributeTypesLink).toBeVisible();
  });
  test('Manage Privileges link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.managePrivilegesLink).toBeVisible();
  });
  test('Manage Roles link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageRolesLink).toBeVisible();
  });
  test('Manage Visit Types link is visible', async ({ configureMetadataPage }) => {
    await expect(configureMetadataPage.manageVisitTypesLink).toBeVisible();
  });

  // ---------- Clicking each link ----------

  test('clicking Manage Concept Dictionary navigates to the concept dictionary', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageConceptDictionary();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/concept|dictionary/i);
  });

  test('clicking Manage Encounter Roles navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageEncounterRoles();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/encounter/i);
  });

  test('clicking Manage Encounter Types navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageEncounterTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/encounter/i);
  });

  test('clicking Manage Forms navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageForms();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/form/i);
  });

  test('clicking Manage Location Attribute Types navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageLocationAttributeTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/location/i);
  });

  test('clicking Manage Location Tags navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageLocationTags();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/location/i);
  });

  test('clicking Manage Locations navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageLocations();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/location/i);
  });

  test('clicking Manage Patient Identifier Types navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManagePatientIdentifierTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/identifier|patient/i);
  });

  test('clicking Manage Provider Attribute Types navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageProviderAttributeTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/provider/i);
  });

  test('clicking Manage Privileges navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManagePrivileges();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/privilege|role/i);
  });

  test('clicking Manage Roles navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageRoles();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/role/i);
  });

  test('clicking Manage Visit Types navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageVisitTypes();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/visit/i);
  });

  test('clicking Manage Mappings navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageMappings();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/mapping/i);
  });

  test('clicking Manage OCL navigates', async ({ configureMetadataPage, page }) => {
    await configureMetadataPage.clickManageOCL();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/ocl|concept/i);
  });
});
