import { Page } from '@playwright/test';

import { params } from '../utils/config';

import { BaseStep } from './base';

let subRef: string;
let caseNumber;

export default class createAndAcceptCase extends BaseStep {
  constructor(page: Page) {
    super(page);
  }

  async setupCaseCreatedViaApi(
    page: Page,
    region: string,
    caseType: string
  ): Promise<{ subRef: string; caseNumber: any }> {
    const createdCase = await this.createCaseThroughApi.processCaseToAcceptedState(region, caseType);
    subRef = createdCase.submissionReference;

    await page.goto(params.TestUrlForManageCaseAAT);
    await this.loginPage.processLogin(params.TestEnvETCaseWorkerUser, params.TestEnvETPassword);
    // The case list search returns "No cases found" for a case that has just been created.
    // Open it by CCD id instead, which does not depend on search indexing.
    await this.caseListPage.openCaseById(caseType, createdCase.caseId);

    caseNumber = createdCase.ethosCaseReference;
    if (!caseNumber) {
      const heading = (await page.locator('h1').first().textContent()) ?? '';
      caseNumber = heading.match(/\d{1,7}\/\d{4}/)?.[0] ?? '';
    }
    if (!caseNumber) {
      throw new Error(`Case ${createdCase.caseId} has no ET case number`);
    }

    // Accept case
    await Promise.all([
      await this.caseListPage.selectNextEvent('Accept/Reject Case'),
      await this.et1CaseServingPage.processET1CaseServingPages(),
    ]);

    // Allow accepted case data to propagate before respondent self-assignment
    await this.page.waitForTimeout(15000);

    return { subRef, caseNumber };
  }
}
