import { BasePage } from "./basePage";

export default class ET3ProcessPage extends BasePage {

    async submitET3Response() {

        await this.delay(20000);
        await this.webActions.verifyElementContainsText(this.page.locator('markdown p'), 'To help you complete this, open the ET1 form', 10000);
        await this.clickContinue();

        await this.webActions.selectByLabelFromDropDown('#et3ChooseRespondent', 'Mrs Test Auto');
        await this.clickContinue();
        await this.delay(10000);
        await this.clickContinue();
        await this.delay(2000);

        await this.webActions.verifyElementContainsText(this.page.locator('legend span'), 'Did we receive the ET3 response in time?', 3000);
        await this.clickContinue();
        await this.delay(2000);

        await this.webActions.verifyElementContainsText(this.page.locator('legend span'), "Do we have the respondent's name?", 3000);
        await this.clickContinue();
        await this.delay(2000);

        const elementMap = new Map<string, string>([
            ["Does the respondent's name match", '#et3DoesRespondentsNameMatch_Yes'],
            ["Do we have the respondent's address?", '#et3DoWeHaveRespondentsAddress_Yes'],
            ["Does the respondent's address match?", '#et3DoesRespondentsAddressMatch_Yes'],
            ["Does the respondent wish to contest any part of the claim?", '#et3ContestClaim-No'],
            ["Is there an Employer's Contract Claim in section 7 of the ET3 response?", '#et3ContractClaimSection7_Yes'],
            ["Is the case listed for hearing?", '#et3IsCaseListedForHearing_No'],
            ["Is this location correct?", '#et3IsThisLocationCorrect-Yes']
          ]);
    
        for (let [key, value] of elementMap) {
            await this.webActions.verifyElementContainsText(this.page.locator('legend span'), key, 3000);
            await this.webActions.clickElementByCss(value);
            await this.clickContinue();
            await this.delay(2000);
        }

        await this.webActions.verifyElementToBeVisible(this.page.locator('#et3Rule26_No'));
        await this.webActions.clickElementByCss('#et3Rule26_No');
        await this.clickContinue();
        await this.delay(2000);

        await this.webActions.verifyElementToBeVisible(this.page.locator('label span'));
        await this.clickContinue();
        await this.delay(2000);
        await this.submitButton();

        await this.webActions.verifyElementContainsText(this.page.locator('#confirmation-header markdown h1'), 'ET3 Processing complete', 10000);
        await this.closeAndReturn();
    }
}