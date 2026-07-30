
import { Locator, Page } from '@playwright/test';

import { params } from '../utils/config';

import { BasePage } from './basePage';

export default class Et3LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly signInOrContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    // Flexible locators covering both new and old IDAM UI
    this.usernameField = page.locator(
      '[data-testid="idam-username-input"], #username, input[name="username"], #email, input[type="email"]'
    );
    this.passwordField = page.locator(
      '[data-testid="idam-password-input"], #password, input[name="password"], input[type="password"]'
    );
    this.signInOrContinueButton = page
      .locator('[data-testid="idam-submit-button"], [name="save"], button[type="submit"], input[type="submit"]')
      .filter({ hasText: /Sign in|Continue/i });
  }

  public static create(page: Page): Et3LoginPage {
    return new Et3LoginPage(page);
  }

  elements = {
    returnToExistingResponse: this.page.locator('[href="/return-to-existing?lng=en"]'),
    submit: this.page.locator('[type="submit"]'),
    startNow: this.page.locator('[href="/case-number-check"]'),
    respondToNewClaim: '[href="/case-number-check?lng=en&redirect=selfAssignment"]',
    caseNumber: '#ethosCaseReference',
    submissionRefNumber: '#caseReferenceId',
    respName: '#respondentName',
    claimantFirstName: '#claimantFirstName',
    claimantLastName: '#claimantLastName',
    caseRefNumber: this.page.locator('#ethosCaseReference'),
  };

  async processRespondentLogin(username: string, password: string, caseNumber: string): Promise<void> {
    // Clear IDAM session so the caseworker login from beforeEach doesn't interfere
    await this.page.context().clearCookies();

    await this.page.goto(params.TestUrlRespondentUi);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Introduction');
    await this.webActions.clickElementByCss('[href="/case-number-check"]');
    await this.wait(10);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, ethosCaseReference);
    await this.clickContinue();
    await this.loginRespondentUi(username, password);
  }

  private async headingText(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator('h1').first().waitFor({ state: 'visible', timeout: 30000 });
    return (await this.page.locator('h1').first().innerText()).trim();
  }

  async loginRespondentUi(username: string, password: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL(/.*/, { waitUntil: 'domcontentloaded' });
    const heading = await this.headingText();

    if (heading === 'Sign in or create an account') {
      if ((await this.usernameField.count()) > 0) {
        // Old IDAM: email + password fields on the same page
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.signInOrContinueButton.click();
      } else {
        // New IDAM: intermediate page — click "Sign in" to reach the email step
        await this.page.getByRole('button', { name: 'Sign in' }).click();
        await this.page.waitForLoadState('load');
        await this.usernameField.fill(username);
        await this.signInOrContinueButton.click();
        await this.page.waitForLoadState('load');
        await this.passwordField.fill(password);
        await this.signInOrContinueButton.click();
      }
    } else if (heading === 'Sign in') {
      // Old IDAM: single-page form
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.signInOrContinueButton.click();
    } else if (heading === 'Enter your email address') {
      // New IDAM: already past the intermediate page
      await this.usernameField.fill(username);
      await this.signInOrContinueButton.click();
      await this.page.waitForLoadState('load');
      await this.passwordField.fill(password);
      await this.signInOrContinueButton.click();
    } else {
      throw new Error(`Unexpected login page heading: '${heading}'`);
    }
  }

  async replyToNewClaim(submissionRef: string, caseNumber: string | string[]): Promise<void> {
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Before you continue');

    await this.continueFromChecklistToSelfAssignment(caseNumber, submissionRef);
    await this.checkAndSubmitPage(caseNumber);
  }

  private normalizeCaseNumber(caseNumber: string | string[]): string {
    const rawValue = Array.isArray(caseNumber) ? caseNumber.join(' ') : caseNumber.toString();
    const caseNumberMatch = rawValue.match(/\d{1,7}\/\d{4}/);

    return caseNumberMatch?.[0] ?? rawValue.trim();
  }

  private getViewCaseLink(ethosCaseReference: string) {
    return this.page.locator(`a[aria-label^="view ${ethosCaseReference}:"]`);
  }

  private async continueFromChecklistToSelfAssignment(
    caseNumber: string | string[],
    submissionRef: string
  ): Promise<void> {
    const ethosCaseReference = this.normalizeCaseNumber(caseNumber);
    await this.clickContinue();
    const heading = this.page.locator('h1');
    await heading.waitFor({ state: 'visible' });

    const pageHeading = (await heading.textContent())?.trim() ?? '';

    if (pageHeading.includes('ET3 Responses')) {
      await this.webActions.clickElementByCss(this.elements.respondToNewClaim);
      await this.caseNumberPage(ethosCaseReference);
    } else if (!pageHeading.includes('Case Details')) {
      await this.webActions.verifyElementContainsText(heading, 'Case Details');
    }

    await this.caseDetailsPage(submissionRef);
  }

  async caseNumberPage(caseNumber: string): Promise<void> {
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, caseNumber.toString());

    await this.clickContinue();
  }

  async caseDetailsPage(submissionRef: string): Promise<void> {
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Details');
    await this.webActions.fillField(this.elements.submissionRefNumber, submissionRef.toString());

    //resp name is hard coded here as case is created from api which is using json
    //check case sensitivity
    await this.webActions.fillField(this.elements.respName, 'mrS test AUto');
    await this.webActions.fillField(this.elements.claimantFirstName, 'GraYSon');
    await this.webActions.fillField(this.elements.claimantLastName, 'BEckEr');
    await this.clickContinue();
  }

  async checkAndSubmitPage(caseNumber: string | string[]): Promise<void> {
    await expect(this.page).toHaveURL(/self-assignment-check/);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Check and submit');

    await this.checkSelfAssignmentConfirmation();
    await this.submitSelfAssignmentWithRetry();

    await this.waitForCaseInAwaitingResponse(caseNumber);
  }

  private async submitSelfAssignmentWithRetry(): Promise<void> {
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.page.getByRole('button', { name: 'Submit' }).click();
      await this.page.waitForLoadState('domcontentloaded');

      try {
        await this.page.waitForURL(/\/(case-list|case-details)(\/|$|\?)/, {
          timeout: 30000,
          waitUntil: 'domcontentloaded',
        });
        return;
      } catch {
        if (attempt === maxAttempts || !this.page.url().includes('self-assignment-check')) {
          await this.assertSelfAssignmentSucceeded();
        }

        await this.page.waitForTimeout(5000);
        await this.checkSelfAssignmentConfirmation();
      }
    }
  }

  private async checkSelfAssignmentConfirmation(): Promise<void> {
    const checkboxByRole = this.page.getByRole('checkbox', {
      name: /I confirm all these details are accurate/i,
    });
    const checkboxById = this.page.locator('#confirmation, #selfAssignmentCheck-confirmation');

    if ((await checkboxByRole.count()) > 0) {
      await checkboxByRole.check();
      await expect(checkboxByRole).toBeChecked();
      return;
    }

    if ((await checkboxById.count()) > 0) {
      await checkboxById.first().check();
      await expect(checkboxById.first()).toBeChecked();
      return;
    }

    const heading = await this.page.locator('h1').textContent();
    throw new Error(
      `Confirmation checkbox not found on ${this.page.url()}. Page heading: ${heading?.trim() ?? 'unknown'}`
    );
  }

  private async assertSelfAssignmentSucceeded(): Promise<void> {
    if (!this.page.url().includes('self-assignment-check')) {
      return;
    }

    const errorTexts = await this.page
      .locator('.govuk-error-summary__list li, .govuk-error-summary__body, .govuk-error-message')
      .allTextContents();
    const visibleErrors = errorTexts
      .map(text => text.trim())
      .filter(Boolean)
      .join('; ');

    throw new Error(
      `Self-assignment submit failed on ${this.page.url()}. ${
        visibleErrors || 'No validation message shown — assignCaseUserRole API likely failed on preview.'
      }`
    );
  }

  private async openCaseList(): Promise<void> {
    const baseUrl = params.TestUrlRespondentUi.replace(/\/$/, '');
    const caseListUrl = `${baseUrl}/case-list?lng=en`;

    if (this.page.url().includes('/case-list')) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      return;
    }

    try {
      await this.page.goto(caseListUrl, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('ERR_ABORTED') || message.includes('detached')) {
        await this.page.waitForLoadState('domcontentloaded');
        return;
      }
      throw error;
    }
  }

  private async waitForCaseInAwaitingResponse(caseNumber: string | string[]): Promise<void> {
    const ethosCaseReference = this.normalizeCaseNumber(caseNumber);

    if (this.page.url().includes('/case-details')) {
      return;
    }

    const viewCaseLink = this.getViewCaseLink(ethosCaseReference);
    const rowViewLink = this.page.getByRole('row').filter({ hasText: ethosCaseReference }).getByRole('link').first();

    await expect(async () => {
      await this.openCaseList();
      await expect(this.page.locator('h1')).toContainText('ET3 Responses', { timeout: 10000 });

      const hasViewLink = (await viewCaseLink.count()) > 0;
      const hasRowLink = (await rowViewLink.count()) > 0;
      expect(hasViewLink || hasRowLink).toBeTruthy();
    }).toPass({ timeout: 90000, intervals: [5000] });

    if ((await viewCaseLink.count()) > 0) {
      await viewCaseLink.first().click();
      return;
    }

    await rowViewLink.click();
  }
}
