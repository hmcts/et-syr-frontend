import { test } from '../fixtures/common.fixture';
import { params } from '../utils/config';


// let caseId: { toString: () => any; };
let caseNumber: any;
let subRef: any;

test.describe('ET3/Respondent Journey', () => {
  test.beforeEach(async ({ page, createCaseStep }) => {
    ({subRef, caseNumber} = await createCaseStep.setupCaseCreatedViaApi(page, "England", "ET_EnglandWales"));

  });

  test('Validate ET3 Form start page and check case sensitivity', {tag: '@smoke'}, async ({ et3LoginPage }) => {
    //Assign a claim to respondent
    await et3LoginPage.processRespondentLogin(params.TestEnvET3RespondentEmailAddress, params.TestEnvET3RespondentPassword, caseNumber);
    await et3LoginPage.replyToNewClaim(subRef, caseNumber);
  });
});
