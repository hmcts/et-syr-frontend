import { Page, expect } from '@playwright/test';

import { params } from '../utils/config';

import { BasePage } from './basePage';

export default class Et3LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
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
  async processRespondentLogin(username: string, password: string, caseNumber: string | string[]): Promise<void> {
    const ethosCaseReference = this.normalizeCaseNumber(caseNumber);
    await this.page.goto(params.TestUrlRespondentUi);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Introduction');
    await this.webActions.clickElementByCss('[href="/case-number-check"]');
    await this.wait(10);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, ethosCaseReference);
    await this.clickContinue();
    await this.loginRespondentUi(username, password);
  }

  async loginRespondentUi(username: string, password: string): Promise<void> {
    await this.webActions.fillField('#username', username);
    await this.webActions.fillField('#password', password);
    await this.elements.submit.click();
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
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Check and submit');
    await this.webActions.checkElementById('#confirmation');

    await Promise.all([
      this.page.waitForURL(/\/(case-list|case-details)(\/|$|\?)/, { timeout: 90000 }),
      this.submitButton(),
    ]);

    await this.waitForCaseInAwaitingResponse(caseNumber);
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
