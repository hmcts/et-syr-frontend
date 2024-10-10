import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { SummaryListRow, addSummaryRowWithAction } from '../../../../main/definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
  getEt3Section6,
} from '../../../../main/helpers/controller/CheckYourAnswersET3Helper';

describe('CheckYourAnswersET3Helper', () => {
  const userCase: CaseWithId = {
    createdDate: '',
    lastModified: '',
    state: undefined,
    id: '1',
    address1: '123 Test St',
    addressPostcode: 'AB12 3CD',
  };

  const translationsMock: AnyRecord = {
    section1: {
      respondentName: 'Respondent Name',
      organisationType: 'Organisation Type',
      preferredTitleOptional: 'Preferred Title (Optional)',
      companyRegistrationNumberOptional: 'Company Registration Number (Optional)',
      address: 'Address',
      contactName: 'Contact Name',
      dxAddressOptional: 'DX Address (Optional)',
      contactFormat: 'Preferred Contact Format',
      reasonForPost: 'Reason for Postal Communication',
      contactLanguage: 'Preferred Language',
      contactNumberOptional: 'Contact Number (Optional)',
      exampleData: 'Example Data',
    },
    section2: {
      participateInHearings: 'Would you be able to take part in hearings by video and phone?',
      explainReason: 'Explain why you are unable to take part in video or phone hearings',
      disabilitySupport:
        'Do you have a physical, mental or learning disability or health condition that means you need support during your case?',
      supportRequest: 'Tell us what support you need to request',
      employeesInGreatBritain: 'How many people does Redde Ltd employ in Great Britain? (optional)',
      multipleSites: 'Does the respondent have more than one site in Great Britain?',
      employeesAtSite: 'How many employed at the site the claimant worked at? (optional)',
      exampleData: '[example data]',
    },
    section3: {
      agreeWithClaimantDetails:
        'Do you agree with the details given by the claimant about early conciliation with Acas?',
      disagreeReason: 'Why do you disagree with the Acas conciliation details given? (optional)',
      employmentDatesCorrect: 'Are the dates of employment given by the claimant correct?',
      et3ResponseEmploymentStartDate: 'Employment start date (optional)',
      et3ResponseEmploymentEndDate: 'Employment end date (optional)',
      furtherInfoEmploymentDates:
        "Do you want to provide any further information about the claimant's employment dates? (optional)",
      continuingEmployment: 'Is the claimant’s employment with the respondent continuing?',
      jobTitleCorrect: 'Is the claimant’s job title correct?',
      correctJobTitle: 'What is or was the claimant’s correct job title? (optional)',
      averageWeeklyHoursCorrect: 'Are the claimant’s average weekly work hours correct?',
      correctAverageWeeklyHours: 'What are the claimant’s correct average weekly work hours? (optional)',
      exampleData: '[example data]',
    },
    section4: {
      payDetailsCorrect: 'Are the pay details given by the claimant correct?',
      paymentFrequency: 'How often was the claimant paid?',
      claimantsPayBeforeTax: 'Enter the claimant’s pay BEFORE tax (optional)',
      claimantsPayAfterTax: 'Enter the claimant’s pay AFTER tax (optional)',
      noticePeriodDetailsCorrect: 'Are the claimant’s notice period details correct?',
      correctPayDetails: 'What are the claimant’s correct pay details? (optional)',
      pensionAndBenefitsDetailsCorrect: 'Are the claimants pension and benefits details correct?',
      correctPensionAndBenefitsDetails: 'What are the claimant’s correct pension and benefits details? (optional)',
      exampleData: '[example data]',
    },
    section5: {
      contestClaim: 'Does [respondent name] contest the claim?',
      contestExplanation: 'Explain why [respondent name] contests the claim (text box label)',
      supportingMaterials: 'Supporting materials',
      exampleData: '[example data]',
    },
    section6: {
      header: 'Employer’s contract claim',
      respondentWantToMakeECC: 'Does the respondent wish to make an Employer’s Contract Claim?',
      employerContractClaimDetails: 'Provide the background and details of your Employer’s Contract Claim',
      supportingMaterials: 'Supporting material',
      exampleData: '[example data]',
    },
    change: 'Change',
  };

  const section1Urls = [
    PageUrls.RESPONDENT_NAME,
    PageUrls.TYPE_OF_ORGANISATION, // for preferredTitleOptional
    PageUrls.TYPE_OF_ORGANISATION, // for companyRegistrationNumberOptional
    PageUrls.TYPE_OF_ORGANISATION, // for companyRegistrationNumberOptional
    PageUrls.RESPONDENT_ADDRESS,
    PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
    PageUrls.RESPONDENT_DX_ADDRESS,
    PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
    PageUrls.RESPONDENT_CONTACT_PREFERENCES,
    PageUrls.RESPONDENT_CONTACT_PREFERENCES, // for reasonForPost
    PageUrls.RESPONDENT_CONTACT_PREFERENCES, // for contactLanguage
  ];

  // Define URLs for sections 2
  const section2Urls = [
    PageUrls.HEARING_PREFERENCES,
    PageUrls.HEARING_PREFERENCES, // for part of the hearing preferences
    PageUrls.REASONABLE_ADJUSTMENTS,
    PageUrls.REASONABLE_ADJUSTMENTS, // for support requests
    PageUrls.RESPONDENT_EMPLOYEES,
    PageUrls.RESPONDENT_SITES,
    PageUrls.RESPONDENT_SITE_EMPLOYEES,
  ];

  const section3Urls = [
    PageUrls.CLAIMANT_ET1_FORM_DETAILS,
    PageUrls.CLAIMANT_ET1_FORM_DETAILS, // for details verification
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
    PageUrls.CLAIMANT_PAY_DETAILS, // for pay details confirmation
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER, // for payment frequency
    PageUrls.CLAIMANT_PAY_DETAILS_ENTER, // for before tax payment
    PageUrls.CLAIMANT_NOTICE_PERIOD,
    PageUrls.NOT_IMPLEMENTED, // for pension and benefits
    PageUrls.NOT_IMPLEMENTED, // CLAIMANT_PENSION_AND_BENEFITS_DETAILS??
  ];

  const section5Urls = [
    PageUrls.RESPONDENT_CONTEST_CLAIM,
    PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
    PageUrls.RESPONDENT_CONTEST_CLAIM_REASON, // for supporting materials
  ];

  const section6Urls = [
    PageUrls.EMPLOYERS_CONTRACT_CLAIM,
    PageUrls.NOT_IMPLEMENTED,
    PageUrls.NOT_IMPLEMENTED, // for supporting materials
  ];

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

    const result = getEt3Section1(userCase, translationsMock);

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

    const result = getEt3Section3(userCase, translationsMock);

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

    const result = getEt3Section5(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });

  // Tests for section 6
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

    const result = getEt3Section6(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });
});
