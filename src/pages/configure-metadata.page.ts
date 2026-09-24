import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { isBrokenPage } from '../utils/helpers';

/**
 * ConfigureMetadataPage - O2 "Configure Metadata" landing tile screen.
 *
 * Two-column layout with sections (green headings, blue underlined links):
 *   Left column:
 *     Concepts        → Manage Concept Dictionary
 *     Encounters      → Manage Encounter Roles, Manage Encounter Types
 *     Forms           → Manage Forms
 *     Locations       → Manage Location Attribute Types, Manage Location Tags, Manage Locations
 *     Metadata Mappings → Manage Mappings
 *     Open Concept Lab → Manage OCL
 *     Patients        → Manage Patient Identifier Types
 *     Providers       → Manage Provider Attribute Types
 *   Right column:
 *     Roles And Privileges → Manage Privileges, Manage Roles
 *     Visits          → Manage Visit Types
 */
export class ConfigureMetadataPage extends BasePage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;

  // Section headings
  readonly conceptsHeading: Locator;
  readonly encountersHeading: Locator;
  readonly formsHeading: Locator;
  readonly locationsHeading: Locator;
  readonly metadataMappingsHeading: Locator;
  readonly openConceptLabHeading: Locator;
  readonly patientsHeading: Locator;
  readonly providersHeading: Locator;
  readonly rolesAndPrivilegesHeading: Locator;
  readonly visitsHeading: Locator;

  // Links under each section
  readonly manageConceptDictionaryLink: Locator;
  readonly manageEncounterRolesLink: Locator;
  readonly manageEncounterTypesLink: Locator;
  readonly manageFormsLink: Locator;
  readonly manageLocationAttributeTypesLink: Locator;
  readonly manageLocationTagsLink: Locator;
  readonly manageLocationsLink: Locator;
  readonly manageMappingsLink: Locator;
  readonly manageOCLLink: Locator;
  readonly managePatientIdentifierTypesLink: Locator;
  readonly manageProviderAttributeTypesLink: Locator;
  readonly managePrivilegesLink: Locator;
  readonly manageRolesLink: Locator;
  readonly manageVisitTypesLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Configure Metadata"), h2:has-text("Configure Metadata")').first();
    this.breadcrumb = page.locator('nav a:has-text("Configure Metadata"), .breadcrumb a:has-text("Configure Metadata")').first();

    this.conceptsHeading = page.locator(':text("Concepts"), h2:has-text("Concepts"), h3:has-text("Concepts")').first();
    this.encountersHeading = page.locator(':text("Encounters"), h2:has-text("Encounters"), h3:has-text("Encounters")').first();
    this.formsHeading = page.locator(':text("Forms"), h2:has-text("Forms"), h3:has-text("Forms")').first();
    this.locationsHeading = page.locator(':text("Locations"), h2:has-text("Locations"), h3:has-text("Locations")').first();
    this.metadataMappingsHeading = page.locator(':text("Metadata Mappings"), h2:has-text("Metadata Mappings"), h3:has-text("Metadata Mappings")').first();
    this.openConceptLabHeading = page.locator(':text("Open Concept Lab"), h2:has-text("Open Concept Lab"), h3:has-text("Open Concept Lab")').first();
    this.patientsHeading = page.locator(':text("Patients"), h2:has-text("Patients"), h3:has-text("Patients")').first();
    this.providersHeading = page.locator(':text("Providers"), h2:has-text("Providers"), h3:has-text("Providers")').first();
    this.rolesAndPrivilegesHeading = page.locator(':text("Roles And Privileges"), h2:has-text("Roles And Privileges"), h3:has-text("Roles And Privileges"), :text("Roles and Privileges")').first();
    this.visitsHeading = page.locator(':text("Visits"), h2:has-text("Visits"), h3:has-text("Visits")').first();

    this.manageConceptDictionaryLink = page.locator('a:has-text("Manage Concept Dictionary")').first();
    this.manageEncounterRolesLink = page.locator('a:has-text("Manage Encounter Roles")').first();
    this.manageEncounterTypesLink = page.locator('a:has-text("Manage Encounter Types")').first();
    this.manageFormsLink = page.locator('a:has-text("Manage Forms")').first();
    this.manageLocationAttributeTypesLink = page.locator('a:has-text("Manage Location Attribute Types")').first();
    this.manageLocationTagsLink = page.locator('a:has-text("Manage Location Tags")').first();
    this.manageLocationsLink = page.locator('a:has-text("Manage Locations")').first();
    this.manageMappingsLink = page.locator('a:has-text("Manage Mappings")').first();
    this.manageOCLLink = page.locator('a:has-text("Manage OCL")').first();
    this.managePatientIdentifierTypesLink = page.locator('a:has-text("Manage Patient Identifier Types")').first();
    this.manageProviderAttributeTypesLink = page.locator('a:has-text("Manage Provider Attribute Types")').first();
    this.managePrivilegesLink = page.locator('a:has-text("Manage Privileges")').first();
    this.manageRolesLink = page.locator('a:has-text("Manage Roles")').first();
    this.manageVisitTypesLink = page.locator('a:has-text("Manage Visit Types")').first();
  }

  async open(): Promise<boolean> {
    // Legacy O2 URL — works on both the public O2 demo and the
    // openmrs-reference-application-distro Docker image (the O3
    // /o3/configure-metadata path only exists on the public demo).
    await this.goto('adminui/metadata/configureMetaData.page');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  /** Returns true when the page rendered its expected content. */
  async waitForReady(): Promise<boolean> {
    if (await this.page.locator('h1:has-text("UI Framework Error")').first().isVisible({ timeout: 500 }).catch(() => false)) {
      return false;
    }
    return await this.heading.isVisible({ timeout: 2000 }).catch(() => false);
  }

  // ---- click helpers ----
  async clickManageConceptDictionary(): Promise<void> { await this.manageConceptDictionaryLink.click(); }
  async clickManageEncounterRoles(): Promise<void> { await this.manageEncounterRolesLink.click(); }
  async clickManageEncounterTypes(): Promise<void> { await this.manageEncounterTypesLink.click(); }
  async clickManageForms(): Promise<void> { await this.manageFormsLink.click(); }
  async clickManageLocationAttributeTypes(): Promise<void> { await this.manageLocationAttributeTypesLink.click(); }
  async clickManageLocationTags(): Promise<void> { await this.manageLocationTagsLink.click(); }
  async clickManageLocations(): Promise<void> { await this.manageLocationsLink.click(); }
  async clickManageMappings(): Promise<void> { await this.manageMappingsLink.click(); }
  async clickManageOCL(): Promise<void> { await this.manageOCLLink.click(); }
  async clickManagePatientIdentifierTypes(): Promise<void> { await this.managePatientIdentifierTypesLink.click(); }
  async clickManageProviderAttributeTypes(): Promise<void> { await this.manageProviderAttributeTypesLink.click(); }
  async clickManagePrivileges(): Promise<void> { await this.managePrivilegesLink.click(); }
  async clickManageRoles(): Promise<void> { await this.manageRolesLink.click(); }
  async clickManageVisitTypes(): Promise<void> { await this.manageVisitTypesLink.click(); }

  async isConceptSectionVisible(): Promise<boolean> { return await this.conceptsHeading.isVisible().catch(() => false); }
  async isEncountersSectionVisible(): Promise<boolean> { return await this.encountersHeading.isVisible().catch(() => false); }
  async isFormsSectionVisible(): Promise<boolean> { return await this.formsHeading.isVisible().catch(() => false); }
  async isLocationsSectionVisible(): Promise<boolean> { return await this.locationsHeading.isVisible().catch(() => false); }
  async isMetadataMappingsSectionVisible(): Promise<boolean> { return await this.metadataMappingsHeading.isVisible().catch(() => false); }
  async isOpenConceptLabSectionVisible(): Promise<boolean> { return await this.openConceptLabHeading.isVisible().catch(() => false); }
  async isPatientsSectionVisible(): Promise<boolean> { return await this.patientsHeading.isVisible().catch(() => false); }
  async isProvidersSectionVisible(): Promise<boolean> { return await this.providersHeading.isVisible().catch(() => false); }
  async isRolesAndPrivilegesSectionVisible(): Promise<boolean> { return await this.rolesAndPrivilegesHeading.isVisible().catch(() => false); }
  async isVisitsSectionVisible(): Promise<boolean> { return await this.visitsHeading.isVisible().catch(() => false); }
}
