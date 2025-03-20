import { BasePage } from "./basePage";
import { params } from "../utils/config";
import { expect, Page } from '@playwright/test';


export default class Et3LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  public static create(page: Page): Et3LoginPage {
    return new Et3LoginPage(page);
  }

  elements={

    returnToExistingResponse:this.page.locator('[href="/return-to-existing?lng=en"]'),
    submit:this.page.locator('[type="submit"]'),
    startNow:this.page.locator('[href="/case-number-check"]'),
    respondToNewClaim: '[href="/case-number-check?lng=en&redirect=selfAssignment"]',
    caseNumber: '#ethosCaseReference',
    submissionRefNumber: '#caseReferenceId',
    respName:'#respondentName',
    claimantFirstName:'#claimantFirstName',
    claimantLastName:'#claimantLastName',
    caseRefNumber:this.page.locator('#ethosCaseReference')
  }
  async processRespondentLogin(username: string, password: string, caseNumber: string) {
    await this.page.goto(params.TestUrlRespondentUi);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Introduction');
    await this.webActions.clickElementByCss('[href="/case-number-check"]');
    await this.wait(10);
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, caseNumber.toString());
    await this.clickContinue();
    await this.loginRespondentUi(username, password);
  }

  async loginRespondentUi(username: string, password: string){
    await this.webActions.fillField('#username', username);
    await this.webActions.fillField('#password', password);
    await this.elements.submit.click();
  }


  async replyToNewClaim(submissionRef: string, caseNumber: string){
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Before you continue');

    await this.clickContinue();
    await this.webActions.verifyElementContainsText(this.page.locator('#main-content'), 'ET3 Responses');
    await this.webActions.clickElementByCss(this.elements.respondToNewClaim);
    await this.caseNumberPage(caseNumber);
    await this.caseDetailsPage(submissionRef);
    await this.checkAndSubmitPage(caseNumber);
  }

  async caseNumberPage(caseNumber: string){
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Number');
    await this.webActions.fillField(this.elements.caseNumber, caseNumber.toString());

    await this.clickContinue();
  }

  async caseDetailsPage(submissionRef: string){
    await this.webActions.verifyElementContainsText(this.page.locator('h1'), 'Case Details');
    await this.webActions.fillField(this.elements.submissionRefNumber, submissionRef.toString());

    //resp name is hard coded here as case is created from api which is using json
    //check case sensitivity
    await this.webActions.fillField(this.elements.respName, 'mrS test AUto');
    await this.webActions.fillField(this.elements.claimantFirstName, 'GraYSon');
    await this.webActions.fillField(this.elements.claimantLastName, 'BEckEr');
    await this.clickContinue();
  }

  async checkAndSubmitPage(caseNumber: string){
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
