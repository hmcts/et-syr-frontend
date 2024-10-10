import {
  CaseType,
  CaseTypeId,
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  NoAcasNumberReason,
  PayInterval,
  Sex,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import { DefaultValues } from '../../../main/definitions/constants';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
  TypesOfClaim,
} from '../../../main/definitions/definition';
import { HubLinkStatus } from '../../../main/definitions/hub';

export const MockCaseWithIdConstants = {
  TEST_SUBMISSION_REFERENCE_NUMBER: '1234567890123456',
  TEST_RESPONDENT_NAME: 'Test Respondent Name',
  TEST_CLAIMANT_NAME: 'Test Claimant Name',
  TEST_CLAIMANT_SURNAME: 'Test Claimant Surname',
};

export const mockValidCaseWithId = <CaseWithId>{
  createdDate: DefaultValues.STRING_EMPTY,
  lastModified: DefaultValues.STRING_EMPTY,
  state: undefined,
  id: MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  respondentName: MockCaseWithIdConstants.TEST_RESPONDENT_NAME,
  firstName: MockCaseWithIdConstants.TEST_CLAIMANT_NAME,
  lastName: MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME,
  typeOfClaim: [TypesOfClaim.DISCRIMINATION],
};

export const mockInvalidCaseWithId = <CaseWithId>{
  createdDate: DefaultValues.STRING_EMPTY,
  lastModified: DefaultValues.STRING_EMPTY,
  state: undefined,
  id: DefaultValues.STRING_EMPTY,
  respondentName: DefaultValues.STRING_EMPTY,
  firstName: DefaultValues.STRING_EMPTY,
  lastName: DefaultValues.STRING_EMPTY,
};

export const mockCaseWithIdWithHubLinkStatuses: CaseWithId = {
  id: '1234',
  caseType: CaseType.SINGLE,
  caseTypeId: CaseTypeId.ENGLAND_WALES,
  claimantRepresentedQuestion: YesOrNo.YES,
  claimantWorkAddressQuestion: YesOrNo.YES,
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  typeOfClaim: ['discrimination', 'payRelated'],
  ClaimantPcqId: '1234',
  dobDate: {
    year: '2010',
    month: '05',
    day: '11',
  },
  claimantSex: Sex.MALE,
  preferredTitle: 'Mr',
  email: 'tester@test.com',
  address1: 'address 1',
  address2: 'address 2',
  addressPostcode: 'TEST',
  addressCountry: 'United',
  addressTown: 'Test',
  telNumber: '075',
  firstName: 'John',
  lastName: 'Doe',
  avgWeeklyHrs: 5,
  claimantPensionContribution: YesOrNoOrNotSure.YES,
  claimantPensionWeeklyContribution: 15,
  employeeBenefits: YesOrNo.YES,
  jobTitle: 'Developer',
  noticePeriod: YesOrNo.YES,
  noticePeriodLength: '1',
  noticePeriodUnit: WeeksOrMonths.WEEKS,
  payBeforeTax: 123,
  payAfterTax: 120,
  payInterval: PayInterval.WEEKLY,
  startDate: { year: '2010', month: '05', day: '11' },
  endDate: { year: '2017', month: '05', day: '11' },
  newJob: YesOrNo.YES,
  newJobStartDate: { year: '2022', month: '08', day: '11' },
  newJobPay: 4000,
  newJobPayInterval: PayInterval.MONTHLY,
  benefitsCharCount: 'Some benefits',
  pastEmployer: YesOrNo.YES,
  isStillWorking: StillWorking.WORKING,
  personalDetailsCheck: YesOrNo.YES,
  reasonableAdjustments: YesOrNo.YES,
  reasonableAdjustmentsDetail: 'Adjustments detail test',
  noticeEnds: { year: '2022', month: '08', day: '11' },
  hearingPreferences: [HearingPreference.PHONE],
  hearingAssistance: 'Hearing assistance test',
  claimantContactPreference: EmailOrPost.EMAIL,
  claimantContactLanguagePreference: EnglishOrWelsh.ENGLISH,
  claimantHearingLanguagePreference: EnglishOrWelsh.ENGLISH,
  employmentAndRespondentCheck: YesOrNo.YES,
  claimTypeDiscrimination: [ClaimTypeDiscrimination.RACE],
  claimTypePay: [ClaimTypePay.REDUNDANCY_PAY],
  claimSummaryText: 'Claim summary text',
  tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
  compensationOutcome: 'Compensation outcome',
  compensationAmount: 123,
  tribunalRecommendationRequest: 'Tribunal recommendation request',
  whistleblowingClaim: YesOrNo.YES,
  whistleblowingEntityName: 'Whistleblowing entity name',
  linkedCases: YesOrNo.YES,
  linkedCasesDetail: 'Linked Cases Detail',
  claimDetailsCheck: YesOrNo.YES,
  workAddress1: 'Respondent Address',
  workAddress2: 'That Road',
  workAddressTown: 'Anytown',
  workAddressCountry: 'England',
  workAddressPostcode: 'SW1H 9AQ',
  respondents: [
    {
      respondentName: 'Globo Corp',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R111111111111',
      noAcasReason: NoAcasNumberReason.ANOTHER,
      respondentAddressLine1: 'Respondent Address',
      respondentAddressLine2: 'That Road',
      respondentAddressPostTown: 'Anytown',
      respondentAddressCountry: 'England',
      respondentAddressPostCode: 'SW1H 9AQ',
      workAddressLine1: 'Respondent Address',
      workAddressLine2: 'That Road',
      workAddressTown: 'Anytown',
      workAddressCountry: 'England',
      workAddressPostcode: 'SW1H 9AQ',
      ccdId: '3453xaa',
    },
  ],
  claimSummaryFile: {
    document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
    document_filename: 'document.pdf',
    document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
  },
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  otherClaim: 'other claim description',
  hubLinksStatuses: {
    documents: HubLinkStatus.READY_TO_VIEW,
    et1ClaimForm: HubLinkStatus.NOT_YET_AVAILABLE,
    hearingDetails: HubLinkStatus.NOT_YET_AVAILABLE,
    tribunalOrders: HubLinkStatus.NOT_YET_AVAILABLE,
    contactTribunal: HubLinkStatus.OPTIONAL,
    respondentResponse: HubLinkStatus.NOT_STARTED_YET,
    tribunalJudgements: HubLinkStatus.NOT_YET_AVAILABLE,
    respondentApplications: HubLinkStatus.NOT_YET_AVAILABLE,
    requestsAndApplications: HubLinkStatus.NOT_YET_AVAILABLE,
  },
};

export const mockCaseWithIdWithRespondents: CaseWithId = {
  id: '1234',
  caseType: CaseType.SINGLE,
  caseTypeId: CaseTypeId.ENGLAND_WALES,
  claimantRepresentedQuestion: YesOrNo.YES,
  claimantWorkAddressQuestion: YesOrNo.YES,
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  typeOfClaim: ['discrimination', 'payRelated'],
  ClaimantPcqId: '1234',
  dobDate: {
    year: '2010',
    month: '05',
    day: '11',
  },
  claimantSex: Sex.MALE,
  preferredTitle: 'Mr',
  email: 'tester@test.com',
  address1: 'address 1',
  address2: 'address 2',
  addressPostcode: 'TEST',
  addressCountry: 'United',
  addressTown: 'Test',
  telNumber: '075',
  firstName: 'John',
  lastName: 'Doe',
  avgWeeklyHrs: 5,
  claimantPensionContribution: YesOrNoOrNotSure.YES,
  claimantPensionWeeklyContribution: 15,
  employeeBenefits: YesOrNo.YES,
  jobTitle: 'Developer',
  noticePeriod: YesOrNo.YES,
  noticePeriodLength: '1',
  noticePeriodUnit: WeeksOrMonths.WEEKS,
  payBeforeTax: 123,
  payAfterTax: 120,
  payInterval: PayInterval.WEEKLY,
  startDate: { year: '2010', month: '05', day: '11' },
  endDate: { year: '2017', month: '05', day: '11' },
  newJob: YesOrNo.YES,
  newJobStartDate: { year: '2022', month: '08', day: '11' },
  newJobPay: 4000,
  newJobPayInterval: PayInterval.MONTHLY,
  benefitsCharCount: 'Some benefits',
  pastEmployer: YesOrNo.YES,
  isStillWorking: StillWorking.WORKING,
  personalDetailsCheck: YesOrNo.YES,
  reasonableAdjustments: YesOrNo.YES,
  reasonableAdjustmentsDetail: 'Adjustments detail test',
  noticeEnds: { year: '2022', month: '08', day: '11' },
  hearingPreferences: [HearingPreference.PHONE],
  hearingAssistance: 'Hearing assistance test',
  claimantContactPreference: EmailOrPost.EMAIL,
  claimantContactLanguagePreference: EnglishOrWelsh.ENGLISH,
  claimantHearingLanguagePreference: EnglishOrWelsh.ENGLISH,
  employmentAndRespondentCheck: YesOrNo.YES,
  claimTypeDiscrimination: [ClaimTypeDiscrimination.RACE],
  claimTypePay: [ClaimTypePay.REDUNDANCY_PAY],
  claimSummaryText: 'Claim summary text',
  tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
  compensationOutcome: 'Compensation outcome',
  compensationAmount: 123,
  tribunalRecommendationRequest: 'Tribunal recommendation request',
  whistleblowingClaim: YesOrNo.YES,
  whistleblowingEntityName: 'Whistleblowing entity name',
  linkedCases: YesOrNo.YES,
  linkedCasesDetail: 'Linked Cases Detail',
  claimDetailsCheck: YesOrNo.YES,
  workAddress1: 'Respondent Address',
  workAddress2: 'That Road',
  workAddressTown: 'Anytown',
  workAddressCountry: 'England',
  workAddressPostcode: 'SW1H 9AQ',
  respondents: [
    {
      respondentName: 'Globo Corp',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R111111111111',
      noAcasReason: NoAcasNumberReason.ANOTHER,
      respondentAddressLine1: 'Respondent Address',
      respondentAddressLine2: 'That Road',
      respondentAddressPostTown: 'Anytown',
      respondentAddressCountry: 'England',
      respondentAddressPostCode: 'SW1H 9AQ',
      workAddressLine1: 'Respondent Address',
      workAddressLine2: 'That Road',
      workAddressTown: 'Anytown',
      workAddressCountry: 'England',
      workAddressPostcode: 'SW1H 9AQ',
      ccdId: '3453xaa',
      idamId: '1234',
    },
  ],
  claimSummaryFile: {
    document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
    document_filename: 'document.pdf',
    document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
  },
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  otherClaim: 'other claim description',
};
