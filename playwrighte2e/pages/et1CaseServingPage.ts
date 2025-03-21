import { BasePage } from './basePage';
const today = new Date();

export default class Et1CaseServingPage extends BasePage {
  elements = {
    //ET1 Vetting Pages...
    date_accepted_day: '#dateAccepted-day',
    date_accepted_month: '#dateAccepted-month',
    date_accepted_year: '#dateAccepted-year',
  };

  async processET1CaseServingPages(): Promise<void> {
    await this.webActions.checkElementByLabel('Yes');
    await this.webActions.fillField(this.elements.date_accepted_day, String(today.getDate()));
    await this.webActions.fillField(this.elements.date_accepted_month, String(today.getMonth() + 1));
    await this.webActions.fillField(this.elements.date_accepted_year, String(today.getFullYear()));
    await this.submitButton();
    await this.delay(5000);
  }

  async getClaimantFirstName(): Promise<{ firstName: string; lastName: string }> {
    await this.webActions.clickElementByCss(
      '//div[@class="mat-tab-labels"]/div[@class="mat-ripple mat-tab-label mat-focus-indicator ng-star-inserted"]/div[.="Claimant"]'
    );
    const firstName = await this.page
      .locator('#case-viewer-field-read--claimantIndType tr:nth-of-type(2) span:nth-of-type(1) span:nth-of-type(1)')
      .innerText();
    const lastName = await this.page
      .locator('#case-viewer-field-read--claimantIndType tr:nth-of-type(3) span:nth-of-type(1) span:nth-of-type(1)')
      .innerText();
    console.log(firstName);
    console.log(lastName);
    return {
      firstName,
      lastName,
    };
  }
}
