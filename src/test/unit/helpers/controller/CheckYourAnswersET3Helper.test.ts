import { AppRequest } from '../../../../main/definitions/appRequest';
import {
  CaseWithId,
  HearingPreferenceET3,
  TypeOfOrganisation,
  YesOrNo,
  YesOrNoOrNotApplicable,
  YesOrNoOrNotSure,
} from '../../../../main/definitions/case';
import { DefaultValues, PageUrls } from '../../../../main/definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../../../main/definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
  getEt3Section6,
} from '../../../../main/helpers/controller/CheckYourAnswersET3Helper';
import checkYourAnswerET3CommonJson from '../../../../main/resources/locales/en/translation/check-your-answers-et3-common.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequest } from '../../mocks/mockRequest';

describe('CheckYourAnswersET3Helper', () => {
  const userCase: CaseWithId = {
    createdDate: '',
    lastModified: '',
    state: undefined,
    id: '1',
    address1: '123 Test St',
    addressPostcode: 'AB12 3CD',
    et3ResponseHearingRespondent: [HearingPreferenceET3.PHONE],
  };

  const translationsMock: AnyRecord = {
    ...checkYourAnswerET3CommonJson,
    ...commonJson,
  };

  const section1Urls = [
    PageUrls.RESPONDENT_NAME,
    PageUrls.TYPE_OF_ORGANISATION, // for preferredTitleOptional
    PageUrls.RESPONDENT_ADDRESS,
    PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
    PageUrls.RESPONDENT_DX_ADDRESS,
    PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
    PageUrls.RESPONDENT_CONTACT_PREFERENCES,
    PageUrls.RESPONDENT_CONTACT_PREFERENCES, // for contactLanguage
  ];

  // Define URLs for sections 2
  const section2Urls = [
    PageUrls.HEARING_PREFERENCES,
    PageUrls.REASONABLE_ADJUSTMENTS,
    PageUrls.RESPONDENT_EMPLOYEES,
    PageUrls.RESPONDENT_SITES,
    PageUrls.RESPONDENT_SITE_EMPLOYEES,
  ];

  const section3Urls = [
    PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
    PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE, // for details verification
    PageUrls.CLAIMANT_EMPLOYMENT_DATES,
    PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER, // for entering employment dates
    PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER, // for end date entry
    PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER, // for further info
    PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
    PageUrls.CLAIMANT_JOB_TITLE,
    PageUrls.CLAIMANT_JOB_TITLE, // for job title verification
    PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
    PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, // for average hours verification
  ];

  const section4Urls = [
    PageUrls.CLAIMANT_PAY_DETAILS,
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER, // for payment frequency
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER, // for before tax payment
    PageUrls.CLAIMANT_NOTICE_PERIOD,
    PageUrls.CLAIMANT_NOTICE_PERIOD,
    PageUrls.CLAIMANT_PENSION_AND_BENEFITS, // for pension and benefits
    PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
  ];

  const section5Urls = [PageUrls.RESPONDENT_CONTEST_CLAIM, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON];
  const section6Urls = [PageUrls.EMPLOYERS_CONTRACT_CLAIM, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS];

  // Test for section 1
  it('should return correct summary list rows for section 1 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section1Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // respondentName
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }
    const request: AppRequest = mockRequest({});
    request.session.userCase = userCase;
    const result = getEt3Section1(request, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Test for section 1 INDIVIDUAL
  it('should return correct summary list rows for section 1 when all fields are populated - INDIVIDUAL', () => {
    const expectedRows: SummaryListRow[] = [];

    section1Urls.splice(2, 0, PageUrls.TYPE_OF_ORGANISATION);

    for (const pageUrl of section1Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // respondentName
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    userCase.et3ResponseRespondentEmployerType = TypeOfOrganisation.INDIVIDUAL;
    const request: AppRequest = mockRequest({});
    request.session.userCase = userCase;
    const result = getEt3Section1(request, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Test for section 1 LIMITED COMPANY
  it('should return correct summary list rows for section 1 when all fields are populated - LIMITED COMPANY', () => {
    const expectedRows: SummaryListRow[] = [];

    // no need to add URL into section1Urls as it was added in previous test

    for (const pageUrl of section1Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // respondentName
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }
    const request: AppRequest = mockRequest({});
    request.session.userCase = userCase;
    userCase.et3ResponseRespondentEmployerType = TypeOfOrganisation.LIMITED_COMPANY;

    const result = getEt3Section1(request, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 2
  it('should return correct summary list rows for section 2 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section2Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    userCase.et3ResponseHearingRespondent = [HearingPreferenceET3.PHONE];
    userCase.et3ResponseRespondentSupportNeeded = YesOrNoOrNotSure.NO;
    userCase.et3ResponseRespondentSupportDetails = '';
    userCase.et3ResponseEmploymentCount = '10';
    userCase.et3ResponseMultipleSites = YesOrNo.YES;
    userCase.et3ResponseSiteEmploymentCount = '100';

    const result = getEt3Section2(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 2 with POST SELECTED
  it('should return correct summary list rows for section 2 when all fields are populated POST selected', () => {
    const expectedRows: SummaryListRow[] = [];

    section2Urls.splice(2, 0, PageUrls.REASONABLE_ADJUSTMENTS);

    for (const pageUrl of section2Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    userCase.et3ResponseHearingRespondent = [HearingPreferenceET3.PHONE];
    userCase.et3ResponseRespondentSupportNeeded = YesOrNoOrNotSure.YES;
    userCase.et3ResponseRespondentSupportDetails = 'Support Needed';
    userCase.et3ResponseEmploymentCount = '10';
    userCase.et3ResponseMultipleSites = YesOrNo.YES;
    userCase.et3ResponseSiteEmploymentCount = '100';

    const result = getEt3Section2(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 3
  it('should return correct summary list rows for section 3 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section3Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    const request: AppRequest = mockRequest({});
    request.session.userCase = userCase;
    userCase.et3ResponseAcasAgree = YesOrNo.NO;
    userCase.et3ResponseAreDatesCorrect = YesOrNoOrNotApplicable.NO;
    userCase.et3ResponseIsJobTitleCorrect = YesOrNoOrNotApplicable.NO;
    userCase.et3ResponseClaimantWeeklyHours = YesOrNoOrNotApplicable.NO;

    const result = getEt3Section3(request, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 4
  it('should return correct summary list rows for section 4 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section4Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    userCase.et3ResponseEarningDetailsCorrect = YesOrNoOrNotApplicable.NO;
    userCase.et3ResponseIsNoticeCorrect = YesOrNoOrNotApplicable.NO;
    userCase.et3ResponseIsPensionCorrect = YesOrNoOrNotApplicable.NO;

    const result = getEt3Section4(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 5
  it('should return correct summary list rows for section 5 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section5Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    // HTML action for the file links
    expectedRows.push(
      addSummaryHtmlRowWithAction(
        expect.any(String), // field3
        DefaultValues.STRING_DASH, // exampleData
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON, // URL for supportingEvidence
        expect.any(String) // change label
      )
    );

    // Populate necessary fields for section 5 in the userCase object
    userCase.et3ResponseRespondentContestClaim = YesOrNo.YES;
    userCase.et3ResponseContestClaimDetails = 'We contest the claim for reason XYZ';
    userCase.et3ResponseContestClaimDocument = undefined;

    const result = getEt3Section5(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Test for section 6
  it('should return correct summary list rows for section 6 when all fields are populated', () => {
    const expectedRows: SummaryListRow[] = [];

    for (const pageUrl of section6Urls) {
      expectedRows.push(
        addSummaryRowWithAction(
          expect.any(String), // field1
          expect.any(String), // exampleData
          pageUrl, // URL
          expect.any(String) // change label
        )
      );
    }

    // HTML action for the file links
    expectedRows.push(
      addSummaryHtmlRowWithAction(
        expect.any(String), // field3
        DefaultValues.STRING_DASH, // exampleData
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS, // URL for supportingEvidence
        expect.any(String) // change label
      )
    );

    // Populate necessary fields for section 6 in the userCase object
    userCase.et3ResponseEmployerClaim = YesOrNo.YES;

    const result = getEt3Section6(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  it('should exclude "Change" links when hideChangeLink is true', () => {
    const request: AppRequest = mockRequest({});
    request.session.userCase = userCase;
    const result = getEt3Section1(request, translationsMock, undefined, true);
    const result2 = getEt3Section2(userCase, translationsMock, undefined, true);
    const result3 = getEt3Section3(request, translationsMock, undefined, true);
    const result4 = getEt3Section4(userCase, translationsMock, undefined, true);
    const result5 = getEt3Section5(userCase, translationsMock, undefined, true);
    const result6 = getEt3Section6(userCase, translationsMock, undefined, true);

    result.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
    result2.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
    result3.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
    result4.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
    result5.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
    result6.forEach(row => {
      // Ensure the action (change link) is undefined
      expect(row.actions).toBeUndefined();
    });
  });
});
