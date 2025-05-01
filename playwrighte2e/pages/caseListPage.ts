import { expect } from '@playwright/test';

import { BasePage } from './basePage';

export default class CaseListPage extends BasePage {
  elements = {
    caseListText: 'Case list',
    caseListLink: '[href="/cases"]',
    caseTypeDropdown: '#wb-case-type',
    submissionReferenceLocator: '#feeGroupReference',
    applyButton: '//button[@class="button workbasket-filters-apply"]',
    nextEventDropdown: this.page.locator('#next-step'),
    submitEventButton: '//button[@class="button"]',
    createCaseLink: 'Create case',
    jurisdictionDropdownLR: '#cc-jurisdiction',
    casetypeDropdownLR: '#cc-case-type',
    eventLR: '#cc-event',
    state: '#wb-case-state',
    managingOffice: '#managingOffice',
    venueDropdown: '#listingVenue',
    causeListText: this.page.locator('//div[@class="alert-message"]'),
    refferTableEle: this.page.locator('ccd-read-text-field'),
    expandImgIcon: 'div a img',
    referralTab: '//div[contains(text(), "Referrals")]',
    depositOrderTab: '//div[contains(text(), "Deposit Order")]',
    tasksTab: '//div[contains(text(), "Tasks")]',
    caseListTab: '//a[contains(text(), "Case list")]',
    allWorkTab: '//a[contains(text(), "All work")]',
    myWorkTab: '//a[contains(text(), "My work")]',
  };

  async searchCaseApplicationWithSubmissionReference(option: string, submissionReference: string): Promise<void> {
    await this.page.reload();
    await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.caseListLink));

    await this.webActions.clickElementByCss(this.elements.caseListLink);
    await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.caseTypeDropdown));

    await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.applyButton));
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case list');
    try {
      switch (option) {
        case 'Eng/Wales - Singles':
          await this.webActions.selectByLabelFromDropDown(this.elements.caseTypeDropdown, 'Eng/Wales - Singles');
          break;
        case 'Scotland - Singles':
          await this.webActions.selectByLabelFromDropDown(this.elements.caseTypeDropdown, 'Scotland - Singles (RET)');
          break;
        default:
          throw new Error('... check you options or add new option');
      }
    } catch (error) {
      console.error('invalid option', error.message);
    }
    await this.webActions.fillField(this.elements.submissionReferenceLocator, submissionReference);
    await expect(async () => {
      await this.webActions.clickElementByCss(this.elements.applyButton);
      await this.webActions.verifyElementContainsText(this.page.locator('#search-result'), submissionReference);
    }).toPass({
      intervals: [2_000, 5_000, 10_000],
      timeout: 80_000,
    });
  }

  async processCaseFromCaseList(): Promise<string[]> {
    const caseNumber = await this.page.getByLabel('go to case with Case').allTextContents();
    console.log('The value of the Case Number ' + caseNumber);
    await this.webActions.clickElementByLabel('go to case with Case');

    await expect(this.page.getByRole('tab', { name: 'Case Details' }).locator('div')).toContainText('Case Details');
    return caseNumber;
  }

  async selectNextEvent(option: string): Promise<void> {
    await Promise.all([
      await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.submitEventButton)),
      await this.page.getByLabel('Next step').selectOption(option),
      await this.delay(3000),
      await this.webActions.clickElementByCss(this.elements.submitEventButton),
    ]);
  }

  async clickTab(tabName: string): Promise<void> {
    await this.webActions.clickElementByText(tabName);
  }
}
