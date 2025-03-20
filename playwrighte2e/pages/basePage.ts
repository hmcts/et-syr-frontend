
import { Page, expect, Locator } from "@playwright/test";
import { WebAction } from "../common/web.action";


export abstract class BasePage {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly saveAsDraftButton:Locator;
  readonly closeAndReturnButton:Locator;
  readonly submit:Locator;
  readonly postcode:Locator;
  readonly findAddress: Locator;
  readonly signout:Locator;
  readonly startNow:Locator;
  readonly saveAndContinue:Locator;
  readonly nextButton:Locator;
  readonly applyFilterButton:Locator;
  readonly addNewBtn: Locator;
  readonly newhearingBtn: string;
  readonly newUploadDocBtn: Locator;
  readonly webActions: WebAction;
  


  constructor(page: Page) {
    this.page = page;
    this.saveAsDraftButton = page.getByRole('button', { name: 'Save as draft' });
    this.closeAndReturnButton = this.page.getByRole('button', { name: 'Close and Return to case' });
    this.applyFilterButton = this.page.getByRole('button', { name: 'Apply filter' });
    this.addNewBtn = page.getByRole('button', { name: 'Add new' });
    this.newhearingBtn = '#hearingCollection > div > button.button.write-collection-add-item__bottom.ng-star-inserted';
    this.newUploadDocBtn = page.locator('//*[@id="documentCollection"]/div/button[2]');
    this.webActions = new WebAction(this.page);
  }

  async wait(time: number) {
    await this.page.waitForTimeout(time)
  }

  async clickContinue() {
    await this.webActions.clickElementByRole('button', { name: 'Continue' });
  }

  async saveAsDraft() {
    await this.saveAsDraftButton.click();
  }

  async closeAndReturn() {
    await this.closeAndReturnButton.click();
  }

  async submitButton(){
    await this.webActions.clickElementByRole('button', { name: 'Submit' });
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async clickNextButton(){
    await this.webActions.clickElementByRole('button', { name: 'Next' });
  }

  async clickElement(elementLocator: string): Promise<void> {
    await this.page.click(elementLocator);
  }

  async enterPostCode(postcode){
    await this.webActions.fillFieldByRole('textbox', { name: 'Enter a UK postcode' }, postcode);
    await this.wait(3000);
    await this.webActions.clickElementByRole('button', { name: 'Find address' });
    await this.wait(3000);
    await this.page.getByLabel('Select an address').selectOption('1: Object');
  }

  async signoutButton(){
    await this.webActions.clickElementByText('Sign out');
  }

  async clickStartNow(){
    await this.webActions.clickElementByRole('button', { name: 'Start now' });
  }

  async saveAndContinueButton(){
    await this.webActions.clickElementByRole('button', { name: 'Save and continue' });
  }

  async addNewButtonClick(){
    await this.addNewBtn.click();
  }

  async addNewHearingButtonClick(){
    await this.webActions.clickElementByCss(this.newhearingBtn);
  }

  async addNewUploadDocButtonClick(){
    await this.newUploadDocBtn.click();
  }

  async processPreLoginPagesForTheDraftApplication(postcode: string) {
    await this.startDraftApplication();
    await this.processBeforeYourContinuePage();
    await this.processWhatsThePostCodeYouHaveWorkedForPage(postcode);
    await this.processAreYouMakingTheClaimForYourselfPage();
    await this.processAreYouMakingTheClaimOnYourOwnPage();
    await this.processDoYouHaveAnACASEarlyConciliation();
    await this.processWhatKindOfClaimAreYouMaking();
  }

  async startDraftApplication() {
    await this.page.waitForSelector('text=Make a claim to an employment tribunal', { timeout: 30000 });
    await this.page.click('text=Start now');
  }

  async processBeforeYourContinuePage() {
    await this.page.waitForSelector('#main-content', { timeout: 5000 });
    await this.page.click('text=Continue');
  }

    async processWhatsThePostCodeYouHaveWorkedForPage(postcode: string) {
    await this.page.waitForSelector('#main-content', { timeout: 5000 });
    await this.page.fill('#workPostcode', postcode);
    await this.page.click('text=Continue');
    }

    async processAreYouMakingTheClaimForYourselfPage() {
    await this.page.waitForSelector('#main-form', { timeout: 5000 });
    await this.page.check('input[id=lip-or-representative]');
    await this.page.click('text=Continue');
    }

    async processAreYouMakingTheClaimOnYourOwnPage() {
    await this.page.waitForSelector('#main-form', { timeout: 5000 });
    await this.page.check('input[id=single-or-multiple-claim]');
    await this.page.click('text=Continue');
    }

    async processDoYouHaveAnACASEarlyConciliation() {
    await this.page.waitForSelector('#main-form', { timeout: 5000 });
    await this.page.check('input[id=acas-multiple]');
    await this.page.click('text=Continue');
    }

    async processWhatKindOfClaimAreYouMaking() {
    await this.page.waitForSelector('#typeOfClaim-hint', { timeout: 5000 });
    await this.page.check('input[value=discrimination]');
    await this.page.check('input[value=whistleBlowing]');
    await this.page.click('text=Continue');
    }
}
