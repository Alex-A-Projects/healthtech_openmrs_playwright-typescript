import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { PatientRegistration } from '../types/ui.types';
import { politeDelay, isBrokenPage } from '../utils/helpers';

/**
 * RegisterPatientPage - O2 "Register a patient" wizard (patient-registration app).
 *
 * UI from screenshots:
 *   - Left sidebar with sections:
 *       Demographics (Name, Gender, Birthdate)
 *       Contact Info (Address, Phone Number)
 *       Relationships (Relatives)
 *       Confirm
 *   - The active section is highlighted blue.
 *   - Right-pane shows the current section's fields.
 *   - Each step has a "Next" (right-arrow green) button.
 *   - On Name step, given-name field has autocomplete suggestions.
 *   - There's an "Unidentified Patient" checkbox.
 */
export class RegisterPatientPage extends BasePage {
  readonly heading: Locator;

  // Sidebar nav links
  readonly sidebarNameLink: Locator;
  readonly sidebarGenderLink: Locator;
  readonly sidebarBirthdateLink: Locator;
  readonly sidebarAddressLink: Locator;
  readonly sidebarPhoneNumberLink: Locator;
  readonly sidebarRelativesLink: Locator;
  readonly sidebarConfirmLink: Locator;

  // Demographics - Name
  readonly givenNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly unidentifiedPatientCheckbox: Locator;
  readonly nameAutocompleteDropdown: Locator;
  readonly nextFromNameButton: Locator;

  // Demographics - Gender
  readonly genderSelect: Locator;
  readonly genderMaleOption: Locator;
  readonly genderFemaleOption: Locator;
  readonly genderUnknownOption: Locator;
  readonly nextFromGenderButton: Locator;

  // Demographics - Birthdate
  readonly birthdateInput: Locator;
  readonly birthdateEstimatedCheckbox: Locator;
  readonly nextFromBirthdateButton: Locator;

  // Contact Info - Address
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryInput: Locator;
  readonly postalCodeInput: Locator;
  readonly nextFromAddressButton: Locator;

  // Contact Info - Phone Number
  readonly phoneInput: Locator;
  readonly nextFromPhoneButton: Locator;

  // Relationships - Relatives
  readonly addRelativeButton: Locator;
  readonly relativeNameInput: Locator;
  readonly relativeTypeSelect: Locator;
  readonly nextFromRelativesButton: Locator;

  // Confirm
  readonly confirmSummary: Locator;
  readonly submitButton: Locator;
  readonly confirmButton: Locator;

  // Generic nav buttons
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly cancelButton: Locator;

  // Field-level errors
  readonly requiredHint: Locator;
  readonly fieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1:has-text("Register a patient"), h2:has-text("Register a patient")').first();

    this.sidebarNameLink = page.locator('aside a:has-text("Name"), aside button:has-text("Name"), a:has-text("Name")').first();
    this.sidebarGenderLink = page.locator('aside a:has-text("Gender"), aside button:has-text("Gender"), a:has-text("Gender")').first();
    this.sidebarBirthdateLink = page.locator('aside a:has-text("Birthdate"), aside button:has-text("Birthdate"), a:has-text("Birthdate")').first();
    this.sidebarAddressLink = page.locator('aside a:has-text("Address"), aside button:has-text("Address"), a:has-text("Address")').first();
    this.sidebarPhoneNumberLink = page.locator('aside a:has-text("Phone Number"), aside button:has-text("Phone Number"), a:has-text("Phone Number")').first();
    this.sidebarRelativesLink = page.locator('aside a:has-text("Relatives"), aside button:has-text("Relatives"), a:has-text("Relatives")').first();
    this.sidebarConfirmLink = page.locator('aside a:has-text("Confirm"), aside button:has-text("Confirm"), a:has-text("Confirm")').first();

    // Name
    this.givenNameInput = page.locator('input[name*="givenName"], input#givenName').first();
    this.middleNameInput = page.locator('input[name*="middleName"], input#middleName').first();
    this.familyNameInput = page.locator('input[name*="familyName"], input#familyName').first();
    this.unidentifiedPatientCheckbox = page.locator('input[type="checkbox"]:near(:text("Unidentified Patient"))').first();
    this.nameAutocompleteDropdown = page.locator('[role="listbox"], .omrs-autocomplete').first();
    this.nextFromNameButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Gender
    this.genderSelect = page.locator('select[name*="gender"], select#gender').first();
    this.genderMaleOption = page.locator('option[value="M"]').first();
    this.genderFemaleOption = page.locator('option[value="F"]').first();
    this.genderUnknownOption = page.locator('option[value="U"]').first();
    this.nextFromGenderButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Birthdate
    this.birthdateInput = page.locator('input[name*="birthdate"], input#birthdate, input[type="date"]').first();
    this.birthdateEstimatedCheckbox = page.locator('input[type="checkbox"]:near(:text("Estimated"))').first();
    this.nextFromBirthdateButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Address
    this.address1Input = page.locator('input[name*="address1"]').first();
    this.address2Input = page.locator('input[name*="address2"]').first();
    this.cityInput = page.locator('input[name*="cityVillage"], input[name*="city"]').first();
    this.stateInput = page.locator('input[name*="stateProvince"], input[name*="state"]').first();
    this.countryInput = page.locator('input[name*="country"]').first();
    this.postalCodeInput = page.locator('input[name*="postalCode"]').first();
    this.nextFromAddressButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Phone
    this.phoneInput = page.locator('input[type="tel"], input[name*="phone"]').first();
    this.nextFromPhoneButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Relatives
    this.addRelativeButton = page.locator('button:has-text("Add"), a:has-text("Add Relative"), button:has-text("Add Relative")').first();
    this.relativeNameInput = page.locator('input[name*="relativeName"], input[placeholder*="relative"]').first();
    this.relativeTypeSelect = page.locator('select[name*="relationship"]').first();
    this.nextFromRelativesButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();

    // Confirm
    this.confirmSummary = page.locator('main').first();
    this.submitButton = page.locator('button[type="submit"]:has-text("Confirm"), button[type="submit"]:has-text("Register"), button[type="submit"]').first();
    this.confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Register Patient")').first();

    this.nextButton = page.locator('button[aria-label="Next"], button:has-text("Next")').first();
    this.backButton = page.locator('button[aria-label="Back"], button:has-text("Back")').first();
    this.cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel")').first();

    this.requiredHint = page.locator(':text("(required)")').first();
    this.fieldError = page.locator('.field-error, .omrs-text-danger, [role="alert"]').first();
  }

  async open(): Promise<boolean> {
    await this.goto('patient-registration/patient.page?appId=referenceapp.registrationapp.registerPatient');
    if (await this.heading.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return !(await isBrokenPage(this.page));
  }

  // ---- step transitions ----

  async clickName(): Promise<void> { await this.sidebarNameLink.click(); }
  async clickGender(): Promise<void> { await this.sidebarGenderLink.click(); }
  async clickBirthdate(): Promise<void> { await this.sidebarBirthdateLink.click(); }
  async clickAddress(): Promise<void> { await this.sidebarAddressLink.click(); }
  async clickPhoneNumber(): Promise<void> { await this.sidebarPhoneNumberLink.click(); }
  async clickRelatives(): Promise<void> { await this.sidebarRelativesLink.click(); }
  async clickConfirm(): Promise<void> { await this.sidebarConfirmLink.click(); }
  async next(): Promise<void> { await this.nextButton.click(); await politeDelay(); }
  async back(): Promise<void> { await this.backButton.click().catch(() => undefined); await politeDelay(); }

  async fillName(given: string, family: string, middle?: string): Promise<void> {
    await this.givenNameInput.fill(given);
    if (middle) await this.middleNameInput.fill(middle);
    await this.familyNameInput.fill(family);
    await politeDelay();
  }

  async selectGender(g: 'M' | 'F' | 'U' | 'O'): Promise<void> {
    await this.genderSelect.selectOption(g);
    await politeDelay();
  }

  async fillBirthdate(date: string, estimated = false): Promise<void> {
    await this.birthdateInput.fill(date);
    if (estimated && (await this.birthdateEstimatedCheckbox.count()) > 0) {
      await this.birthdateEstimatedCheckbox.check();
    }
    await politeDelay();
  }

  async fillAddress(addr: PatientRegistration['address']): Promise<void> {
    if (addr.address1) await this.address1Input.fill(addr.address1);
    if (addr.address2) await this.address2Input.fill(addr.address2);
    if (addr.city) await this.cityInput.fill(addr.city);
    if (addr.state) await this.stateInput.fill(addr.state);
    if (addr.country) await this.countryInput.fill(addr.country);
    if (addr.postalCode) await this.postalCodeInput.fill(addr.postalCode);
    await politeDelay();
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
    await politeDelay();
  }

  async fillDemographics(demo: PatientRegistration['demographics']): Promise<void> {
    await this.fillName(demo.givenName, demo.familyName, demo.middleName);
    await this.next();
    await this.selectGender(demo.gender);
    await this.next();
    await this.fillBirthdate(demo.birthdate, demo.birthdateEstimated);
  }

  async fillContact(addr: PatientRegistration['address'], contact?: PatientRegistration['contact']): Promise<void> {
    await this.fillAddress(addr);
    await this.next();
    if (contact?.phone) await this.fillPhone(contact.phone);
  }

  /** Back-compat alias used by older specs. */
  async fillIdentifier(value = ''): Promise<void> {
    // O3's new wizard doesn't have a separate identifier step (identifier is auto-generated).
    // The argument is preserved so older specs compile.
    await politeDelay();
  }

  /** Back-compat alias used by older specs. */
  async submit(): Promise<void> {
    await this.confirmButton.click();
    await this.page.waitForURL(/patientDashboard\.page|\/patient\//, { timeout: 30_000 }).catch(() => undefined);
  }

  /** End-to-end happy path through every wizard step. */
  async registerPatient(reg: PatientRegistration): Promise<void> {
    await this.open();
    await this.fillDemographics(reg.demographics);
    await this.next();
    await this.fillContact(reg.address, reg.contact);
    await this.next();
    // Skip Relatives step for brevity
    await this.next();
    await this.confirmButton.click();
    await this.page.waitForURL(/patientDashboard\.page|\/patient\//, { timeout: 30_000 }).catch(() => undefined);
  }

  async checkUnidentified(): Promise<void> {
    await this.unidentifiedPatientCheckbox.check();
  }

  async currentSectionLabel(): Promise<string> {
    const active = this.page.locator('aside .active, aside [aria-current="page"], aside a[aria-selected="true"]').first();
    return ((await active.textContent()) ?? '').trim();
  }
}
