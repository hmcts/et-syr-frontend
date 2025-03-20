import { BasePage } from "./basePage";
import { expect } from "@playwright/test";
import { params } from "../utils/config";
import dateUtilComponent from "../utils/DateUtilComponent";


const referralData = require('../data/ui-data/referral-content.json');

export default class CaseListPage extends BasePage{
  elements = {
      caseListText:'Case list',
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
      managingOffice:'#managingOffice',
      venueDropdown: '#listingVenue',
      causeListText :this.page.locator( '//div[@class="alert-message"]'),
      refferTableEle: this.page.locator('ccd-read-text-field'),
      expandImgIcon: 'div a img',
      referralTab: '//div[contains(text(), "Referrals")]',
      depositOrderTab: '//div[contains(text(), "Deposit Order")]',
      tasksTab: '//div[contains(text(), "Tasks")]',
      caseListTab: '//a[contains(text(), "Case list")]',
      allWorkTab: '//a[contains(text(), "All work")]',
      myWorkTab: '//a[contains(text(), "My work")]'
  };

  async searchCaseApplicationWithSubmissionReference(option: any, submissionReference: any) {
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
      await this.webActions.clickElementByCss(this.elements.applyButton);
      await this.webActions.verifyElementContainsText(this.page.locator('#search-result'), submissionReference);
  }


  async processCaseFromCaseList() {
      let caseNumber = await this.page.getByLabel('go to case with Case').allTextContents();
      console.log('The value of the Case Number ' +caseNumber);
      await this.webActions.clickElementByLabel('go to case with Case');

      await expect(this.page.getByRole('tab', { name: 'Case Details' }).locator('div')).toContainText('Case Details');
      return caseNumber;
  }

  async selectNextEvent(option: any) {

      await Promise.all([
        await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.submitEventButton)),
        await this.page.getByLabel('Next step').selectOption(option),
        await this.delay(3000),
        await this.webActions.clickElementByCss(this.elements.submitEventButton)
      ]);
  }

  async claimantRepCreateCase(jurisdiction: any, caseType: any, postcode: any) {
      await this.webActions.clickElementByText(this.elements.createCaseLink);
      await this.webActions.selectByLabelFromDropDown(this.elements.jurisdictionDropdownLR, jurisdiction);

      await this.webActions.selectByLabelFromDropDown(this.elements.casetypeDropdownLR, caseType);
      await this.webActions.selectByLabelFromDropDown(this.elements.eventLR, 'Create draft claim');
      await this.webActions.clickElementByCss(this.elements.submitEventButton);

      await this.enterPostCode(postcode);
      await this.submitButton();
  }

  async clickTab(tabName: any){
    await this.webActions.clickElementByText(tabName);
  }

  async navigateToTab(tabName : string): Promise<void> {

    switch(tabName) {
        case "ICTab": {
            await this.webActions.clickElementByRole('tab', { name: 'Initial Consideration', exact: true });
            break;
        }
        case "Respondent": {
            await this.webActions.clickElementByRole('tab', { name: 'Respondent', exact: true });
            break;
        }
        case "Claimant": {
          await this.webActions.clickElementByRole('tab', { name: 'Claimant', exact: true });
          break;
        }
        case "Documents":{
            await this.webActions.clickElementByRole('tab', { name: 'Documents', exact: true });
            break;
        }
        case "Referrals":{
            await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.referralTab));
            await this.webActions.clickElementByCss(this.elements.referralTab);
            break;
        }
        case "Judgments": {
            await this.webActions.clickElementByRole('tab', { name: 'Judgments', exact: true });
            break;
        }
        case "BF Actions": {
          await this.webActions.clickElementByRole('tab', { name: 'BF Actions', exact: true });
          break;
       }
       case "Case list": {
        await this.webActions.clickElementByCss(this.elements.caseListTab);
        break;
       }
       case "All work": {
        await this.webActions.clickElementByCss(this.elements.allWorkTab);
        break;
       }
       case "My work": {
        await this.webActions.clickElementByCss(this.elements.myWorkTab);
        break;
       }
       case "Deposit Order": {
          const ele = this.page.locator(this.elements.depositOrderTab).nth(1);
          await this.webActions.verifyElementToBeVisible(ele);
          await ele.click();
          break;
       }
        case "Tasks":{
            await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.tasksTab));
            await this.webActions.clickElementByCss(this.elements.tasksTab);
            break;
        }
        default: {
          //statements;
          break;
      }
    }
  }

  async searchHearingReports(option: any, state: any, officeLocation: any ) {

      await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.caseListLink));
      await this.webActions.clickElementByCss(this.elements.caseListLink);

        await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.caseTypeDropdown));
        await this.webActions.verifyElementToBeVisible(this.page.locator(this.elements.applyButton));
        await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case list');

        try {
          switch (option) {
              case 'Eng/Wales - Hearings/Reports':
                await this.webActions.selectByLabelFromDropDown(this.elements.caseTypeDropdown, 'Eng/Wales - Hearings/Reports');
                break;
              default:
                throw new Error('... check you options or add new option');
          }
        } catch (error) {
            console.error('invalid option', error.message);
        }
        await this.webActions.selectByLabelFromDropDown(this.elements.state, state);
        await this.webActions.selectByLabelFromDropDown(this.elements.managingOffice, officeLocation);
        await this.webActions.clickElementByCss(this.elements.applyButton);
  }
}
