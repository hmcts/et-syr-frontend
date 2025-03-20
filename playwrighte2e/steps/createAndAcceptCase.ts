import { Page } from '@playwright/test';

import { params } from '../utils/config';

import { BaseStep } from './base';

let subRef: string;
let submissionRef: string;
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
    submissionRef = await this.createCaseThroughApi.processCaseToAcceptedState(region, caseType);
    subRef = submissionRef.toString();

    await page.goto(params.TestUrlForManageCaseAAT);
    await this.loginPage.processLogin(params.TestEnvETCaseWorkerUser, params.TestEnvETPassword);
    const searchReference = region === 'England' ? 'Eng/Wales - Singles' : `${region} - Singles`;
    await this.caseListPage.searchCaseApplicationWithSubmissionReference(searchReference, subRef);
    caseNumber = await this.caseListPage.processCaseFromCaseList();

    // Accept case
    await Promise.all([
      await this.caseListPage.selectNextEvent('Accept/Reject Case'),
      await this.et1CaseServingPage.processET1CaseServingPages(),
    ]);

    return { subRef, caseNumber };
  }
}
