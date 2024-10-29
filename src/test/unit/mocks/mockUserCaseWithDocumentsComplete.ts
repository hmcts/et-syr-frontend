import {
  CaseType,
  CaseTypeId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  NoAcasNumberReason,
  PayInterval,
  Sex,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotApplicable,
} from '../../../main/definitions/case';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
} from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';

export default {
  id: '1234',
  createdDate: '19 August 2022',
  lastModified: '19 August 2022',
  typeOfClaim: ['discrimination', 'payRelated'],
  dobDate: {
    day: '05',
    month: '10',
    year: '2022',
  },
  ethosCaseReference: '123456/2022',
  feeGroupReference: '1234',
  ClaimantPcqId: '1234',
  claimantSex: Sex.MALE,
  preferredTitle: 'Mr',
  email: 'janedoe@exmaple.com',
  address1: 'address 1',
  address2: 'address 2',
  addressPostcode: 'TEST',
  addressCountry: 'United',
  addressTown: 'Test',
  telNumber: '075',
  firstName: 'Jane',
  lastName: 'Doe',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  caseType: CaseType.SINGLE,
  caseTypeId: CaseTypeId.ENGLAND_WALES,
  claimantRepresentedQuestion: YesOrNo.YES,
  avgWeeklyHrs: 5,
  claimantPensionContribution: YesOrNoOrNotApplicable.YES,
  claimantPensionWeeklyContribution: 15,
  employeeBenefits: YesOrNo.YES,
  jobTitle: 'Developer',
  noticePeriod: YesOrNo.YES,
  noticePeriodLength: '1',
  noticePeriodUnit: WeeksOrMonths.WEEKS,
  payBeforeTax: 123,
  payAfterTax: 120,
  payInterval: PayInterval.WEEKS,
  startDate: { year: '2010', month: '05', day: '11' },
  endDate: { year: '2017', month: '05', day: '11' },
  benefitsCharCount: 'Some benefits',
  newJob: YesOrNo.YES,
  newJobStartDate: { year: '2010', month: '05', day: '12' },
  newJobPay: 4000,
  newJobPayInterval: PayInterval.MONTHS,
  isStillWorking: StillWorking.WORKING,
  pastEmployer: YesOrNo.YES,
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
  claimDetailsCheck: YesOrNo.YES,
  claimantWorkAddressQuestion: YesOrNo.YES,
  workAddress1: 'Respondent Address',
  workAddress2: 'That Road',
  workAddressTown: 'Anytown',
  workAddressCountry: 'England',
  workAddressPostcode: 'SW1H 9AQ',
  otherClaim: 'other type of claims',
  respondents: [
    {
      respondentName: 'Globo Corp',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R111111111111',
      noAcasReason: NoAcasNumberReason.ANOTHER,
      respondentAddress1: 'Respondent Address',
      respondentAddress2: 'That Road',
      respondentAddressTown: 'Anytown',
      respondentAddressCountry: 'England',
      respondentAddressPostcode: 'SW1H 9AQ',
      ccdId: '3453xaa',
    },
    {
      respondentName: 'Version1',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R111111111112',
      noAcasReason: NoAcasNumberReason.ANOTHER,
      respondentAddress1: 'Ad1',
      respondentAddress2: 'Ad2',
      respondentAddressTown: 'Town2',
      respondentAddressCountry: 'Country2',
      respondentAddressPostcode: 'SW1A 1AA',
      ccdId: '3454xaa',
    },
  ],
  et3ResponseReceived: true,
  claimSummaryFile: {
    document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
    document_filename: 'document.pdf',
    document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
  },
  hubLinksStatuses: new HubLinksStatuses(),
  managingOffice: 'Leeds',
  tribunalCorrespondenceEmail: 'leedsoffice@gov.co.uk',
  tribunalCorrespondenceTelephone: '0300 123 1024',
  submittedDate: { day: '03', month: '10', year: '2022' },
  acknowledgementOfClaimLetterDetail: [
    { id: '1', description: 'desc1' },
    { id: '2', description: 'desc2' },
  ],
  respondentResponseDeadline: undefined,
  rejectionOfClaimDocumentDetail: [
    { id: '3', description: 'desc3' },
    { id: '4', description: 'desc4' },
  ],
  responseAcknowledgementDocumentDetail: [
    { id: '5', description: 'desc5' },
    { id: '6', description: 'desc6' },
  ],
  responseRejectionDocumentDetail: [
    { id: '7', description: 'desc7' },
    { id: '8', description: 'desc8' },
  ],
  responseEt3FormDocumentDetail: [],
  et1SubmittedForm: {
    id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673',
    description: 'Case Details - Sunday Ayeni',
    type: 'ET1',
  },
};
