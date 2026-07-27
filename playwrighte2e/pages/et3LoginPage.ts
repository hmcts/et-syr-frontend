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
    await this.page.goto(params.TestUrlRespondentUi);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Introduction');
    await this.webActions.clickElementByCss('[href="/case-number-check"]');
    await this.wait(10);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, caseNumber.toString());
    await this.clickContinue();
    await this.loginRespondentUi(username, password);
  }

  private async headingText(): Promise<string> {
    await this.page.waitForLoadState('load');
    return (await this.page.locator('h1').first().innerText()).trim();
  }

  async loginRespondentUi(username: string, password: string): Promise<void> {
    await this.page.waitForLoadState('load');
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

  async replyToNewClaim(submissionRef: string, caseNumber: string): Promise<void> {
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Before you continue');

    await this.clickContinue();
    await this.webActions.verifyElementContainsText(this.page.locator('#main-content'), 'ET3 Responses');
    await this.webActions.clickElementByCss(this.elements.respondToNewClaim);
    await this.caseNumberPage(caseNumber);
    await this.caseDetailsPage(submissionRef);
    await this.checkAndSubmitPage(caseNumber);
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

  async checkAndSubmitPage(caseNumber: string): Promise<void> {
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Check and submit');
    await this.webActions.checkElementById('#confirmation');
    await this.submitButton();

    //validate claim is displayed in awaiting response
    await this.page.reload();
    await this.webActions.verifyElementContainsText(this.page.locator('#main-content'), 'ET3 Responses');
    await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.respondToNewClaim));
    await this.webActions.clickElementByLabel('view ' + caseNumber.toString() + ':');
  }
}
