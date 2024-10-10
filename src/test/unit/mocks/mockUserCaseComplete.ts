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
  YesOrNoOrNotSure,
} from '../../../main/definitions/case';
import {
  RespondNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, Parties, ResponseRequired } from '../../../main/definitions/constants';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
} from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { ET3CaseDetailsLinksStatuses, ET3HubLinksStatuses } from '../../../main/definitions/links';

/**
 * Creates a notification response from the tribunal requesting more information that has not been viewed yet.
 */
export const getOrderOrRequestTribunalResponse = (): RespondNotificationType => {
  return {
    isClaimantResponseDue: ResponseRequired.YES,
    respondNotificationAdditionalInfo: 'additional info',
    respondNotificationCaseManagementMadeBy: 'Legal officer',
    respondNotificationCmoOrRequest: 'Case management order',
    respondNotificationDate: '2019-05-03',
    respondNotificationFullName: 'Judge Dredd',
    respondNotificationPartyToNotify: Parties.BOTH_PARTIES,
    respondNotificationRequestMadeBy: 'Legal officer',
    respondNotificationResponseRequired: ResponseRequired.YES,
    respondNotificationTitle: 'title',
    respondNotificationUploadDocument: [
      {
        downloadLink: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
        id: '00000000-0000-0000-0000-000000000000',
        value: {
          typeOfDocument: 'ACAS Certificate',
          uploadedDocument: {
            document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
            document_filename: 'ET1_ACAS_CERTIFICATE_Sunday_Ayeni_R600227_21_75.pdf',
            document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
          },
          shortDescription: 'ACAS Certificate - Sunday Ayeni - R600227/21/75',
        },
      },
    ],
    respondNotificationWhoRespond: 'Legal officer',
    state: undefined,
  };
};

export const selectedRequestOrOrder: SendNotificationTypeItem = {
  id: '123',
  value: {
    number: '1',
    sendNotificationTitle: 'title',
    sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
    sendNotificationSelectHearing: {
      selectedLabel: 'Hearing',
    },
    date: '2019-05-03',
    sentBy: 'Tribunal',
    sendNotificationCaseManagement: 'Order',
    sendNotificationResponseTribunal: 'required',
    sendNotificationSelectParties: 'Both',
    sendNotificationAdditionalInfo: 'additional info',
    sendNotificationWhoCaseOrder: 'Legal officer',
    sendNotificationFullName: 'Judge Dredd',
    sendNotificationNotify: 'Both',
    notificationState: 'notViewedYet',
  },
};

export default {
  id: '1234',
  ccdId: '1234',
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
  addressEnterPostcode: 'TEST',
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
  benefitsCharCount: 'Some benefits',
  newJob: YesOrNo.YES,
  newJobStartDate: { year: '2010', month: '05', day: '12' },
  newJobPay: 4000,
  newJobPayInterval: PayInterval.MONTHLY,
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
  linkedCases: YesOrNo.YES,
  linkedCasesDetail: 'Linked Cases Detail',
  claimDetailsCheck: YesOrNo.YES,
  claimantWorkAddressQuestion: YesOrNo.YES,
  workAddress1: 'Respondent Address',
  workAddress2: 'That Road',
  workAddressTown: 'Anytown',
  workAddressCountry: 'England',
  workAddressPostcode: 'SW1H 9AQ',
  workEnterPostcode: 'SW1H 9AQ',
  otherClaim: 'other type of claims',
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
      respondentEnterPostcode: 'SW1H 9AQ',
      ccdId: '3453xaa',
      respondentACAS: 'R111111111111',
      respondentACASNo: 'Another person',
      respondentACASQuestion: 'Yes',
      respondentAddress: {
        AddressLine1: 'Respondent Address',
        AddressLine2: 'That Road',
        Country: 'England',
        PostCode: 'SW1H 9AQ',
        PostTown: 'Anytown',
      },
      claimantWorkAddress: undefined,
      responseReceived: 'Yes',
      responseStatus: undefined,
      responseToClaim: undefined,
      rejectionReason: undefined,
      rejectionReasonOther: undefined,
      responseOutOfTime: undefined,
      responseNotOnPrescribedForm: undefined,
      responseRequiredInfoAbsent: undefined,
      responseNotes: undefined,
      responseReferredToJudge: undefined,
      responseReturnedFromJudge: undefined,
      respondentType: undefined,
      respondentOrganisation: undefined,
      respondentFirstName: undefined,
      respondentLastName: undefined,
      respondentPhone1: undefined,
      respondentPhone2: undefined,
      respondentEmail: undefined,
      responseStruckOut: undefined,
      respondentContactPreference: undefined,
      responseStruckOutDate: undefined,
      responseStruckOutChairman: undefined,
      responseStruckOutReason: undefined,
      responseRespondentAddress: undefined,
      responseRespondentPhone1: undefined,
      responseRespondentPhone2: undefined,
      responseRespondentEmail: undefined,
      responseRespondentContactPreference: undefined,
      responseReceivedDate: undefined,
      responseReceivedCount: undefined,
      responseRespondentNameQuestion: undefined,
      responseRespondentName: undefined,
      responseContinue: undefined,
      responseCounterClaim: undefined,
      responseReference: undefined,
      extensionRequested: undefined,
      extensionGranted: undefined,
      extensionDate: undefined,
      extensionResubmitted: undefined,
      et3Vetting: undefined,
      et3VettingCompleted: undefined,
      et3ResponseIsClaimantNameCorrect: undefined,
      et3ResponseClaimantNameCorrection: undefined,
      et3ResponseRespondentCompanyNumber: undefined,
      et3ResponseRespondentEmployerType: undefined,
      et3ResponseRespondentPreferredTitle: undefined,
      et3ResponseRespondentContactName: undefined,
      et3ResponseDXAddress: undefined,
      et3ResponseContactReason: undefined,
      et3ResponseHearingRepresentative: undefined,
      et3ResponseHearingRespondent: undefined,
      et3ResponseEmploymentCount: undefined,
      et3ResponseMultipleSites: undefined,
      et3ResponseSiteEmploymentCount: undefined,
      et3ResponseAcasAgree: undefined,
      et3ResponseAcasAgreeReason: undefined,
      et3ResponseAreDatesCorrect: undefined,
      et3ResponseEmploymentStartDate: undefined,
      et3ResponseEmploymentEndDate: undefined,
      et3ResponseEmploymentInformation: undefined,
      et3ResponseContinuingEmployment: undefined,
      et3ResponseIsJobTitleCorrect: undefined,
      et3ResponseCorrectJobTitle: undefined,
      et3ResponseClaimantWeeklyHours: undefined,
      et3ResponseClaimantCorrectHours: undefined,
      et3ResponseEarningDetailsCorrect: undefined,
      et3ResponsePayFrequency: undefined,
      et3ResponsePayBeforeTax: undefined,
      et3ResponsePayTakehome: undefined,
      et3ResponseIsNoticeCorrect: undefined,
      et3ResponseCorrectNoticeDetails: undefined,
      et3ResponseIsPensionCorrect: undefined,
      et3ResponsePensionCorrectDetails: undefined,
      et3ResponseRespondentContestClaim: undefined,
      et3ResponseContestClaimDocument: undefined,
      et3ResponseContestClaimDetails: undefined,
      et3ResponseEmployerClaim: undefined,
      et3ResponseEmployerClaimDetails: undefined,
      et3ResponseEmployerClaimDocument: undefined,
      et3ResponseRespondentSupportNeeded: undefined,
      et3ResponseRespondentSupportDetails: undefined,
      et3ResponseRespondentSupportDocument: undefined,
      et3Form: undefined,
      personalDetailsSection: undefined,
      employmentDetailsSection: undefined,
      claimDetailsSection: undefined,
      workAddressLine1: undefined,
      workAddressLine2: undefined,
      workAddressCountry: undefined,
      workAddressPostcode: undefined,
      workAddressTown: undefined,
      idamId: '1234',
      et3CaseDetailsLinksStatuses: new ET3CaseDetailsLinksStatuses(),
      et3HubLinksStatuses: new ET3HubLinksStatuses(),
    },
    {
      respondentName: 'Version1',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R111111111112',
      noAcasReason: NoAcasNumberReason.ANOTHER,
      respondentAddressLine1: 'Ad1',
      respondentAddressLine2: 'Ad2',
      respondentAddressPostTown: 'Town2',
      respondentAddressCountry: 'Country2',
      respondentAddressPostCode: 'SW1A 1AA',
      respondentEnterPostcode: 'SW1A 1AA',
      ccdId: '3454xaa',
      respondentACAS: 'R111111111112',
      respondentACASNo: 'Another person',
      respondentACASQuestion: 'Yes',
      respondentAddress: {
        AddressLine1: 'Ad1',
        AddressLine2: 'Ad2',
        Country: 'Country2',
        PostCode: 'SW1A 1AA',
        PostTown: 'Town2',
      },
      claimantWorkAddress: undefined,
      responseReceived: undefined,
      responseStatus: undefined,
      responseToClaim: undefined,
      rejectionReason: undefined,
      rejectionReasonOther: undefined,
      responseOutOfTime: undefined,
      responseNotOnPrescribedForm: undefined,
      responseRequiredInfoAbsent: undefined,
      responseNotes: undefined,
      responseReferredToJudge: undefined,
      responseReturnedFromJudge: undefined,
      respondentType: undefined,
      respondentOrganisation: undefined,
      respondentFirstName: undefined,
      respondentLastName: undefined,
      respondentPhone1: undefined,
      respondentPhone2: undefined,
      respondentEmail: undefined,
      responseStruckOut: undefined,
      respondentContactPreference: undefined,
      responseStruckOutDate: undefined,
      responseStruckOutChairman: undefined,
      responseStruckOutReason: undefined,
      responseRespondentAddress: undefined,
      responseRespondentPhone1: undefined,
      responseRespondentPhone2: undefined,
      responseRespondentEmail: undefined,
      responseRespondentContactPreference: undefined,
      responseReceivedDate: undefined,
      responseReceivedCount: undefined,
      responseRespondentNameQuestion: undefined,
      responseRespondentName: undefined,
      responseContinue: undefined,
      responseCounterClaim: undefined,
      responseReference: undefined,
      extensionRequested: undefined,
      extensionGranted: undefined,
      extensionDate: undefined,
      extensionResubmitted: undefined,
      et3Vetting: undefined,
      et3VettingCompleted: undefined,
      et3ResponseIsClaimantNameCorrect: undefined,
      et3ResponseClaimantNameCorrection: undefined,
      et3ResponseRespondentCompanyNumber: undefined,
      et3ResponseRespondentEmployerType: undefined,
      et3ResponseRespondentPreferredTitle: undefined,
      et3ResponseRespondentContactName: undefined,
      et3ResponseDXAddress: undefined,
      et3ResponseContactReason: undefined,
      et3ResponseHearingRepresentative: undefined,
      et3ResponseHearingRespondent: undefined,
      et3ResponseEmploymentCount: undefined,
      et3ResponseMultipleSites: undefined,
      et3ResponseSiteEmploymentCount: undefined,
      et3ResponseAcasAgree: undefined,
      et3ResponseAcasAgreeReason: undefined,
      et3ResponseAreDatesCorrect: undefined,
      et3ResponseEmploymentStartDate: undefined,
      et3ResponseEmploymentEndDate: undefined,
      et3ResponseEmploymentInformation: undefined,
      et3ResponseContinuingEmployment: undefined,
      et3ResponseIsJobTitleCorrect: undefined,
      et3ResponseCorrectJobTitle: undefined,
      et3ResponseClaimantWeeklyHours: undefined,
      et3ResponseClaimantCorrectHours: undefined,
      et3ResponseEarningDetailsCorrect: undefined,
      et3ResponsePayFrequency: undefined,
      et3ResponsePayBeforeTax: undefined,
      et3ResponsePayTakehome: undefined,
      et3ResponseIsNoticeCorrect: undefined,
      et3ResponseCorrectNoticeDetails: undefined,
      et3ResponseIsPensionCorrect: undefined,
      et3ResponsePensionCorrectDetails: undefined,
      et3ResponseRespondentContestClaim: undefined,
      et3ResponseContestClaimDocument: undefined,
      et3ResponseContestClaimDetails: undefined,
      et3ResponseEmployerClaim: undefined,
      et3ResponseEmployerClaimDetails: undefined,
      et3ResponseEmployerClaimDocument: undefined,
      et3ResponseRespondentSupportNeeded: undefined,
      et3ResponseRespondentSupportDetails: undefined,
      et3ResponseRespondentSupportDocument: undefined,
      et3Form: undefined,
      personalDetailsSection: undefined,
      employmentDetailsSection: undefined,
      claimDetailsSection: undefined,
      workAddressLine1: undefined,
      workAddressLine2: undefined,
      workAddressCountry: undefined,
      workAddressPostcode: undefined,
      workAddressTown: undefined,
      idamId: undefined,
      et3CaseDetailsLinksStatuses: undefined,
      et3HubLinksStatuses: undefined,
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
  acknowledgementOfClaimLetterDetail: undefined,
  respondentResponseDeadline: undefined,
  rejectionOfClaimDocumentDetail: undefined,
  responseAcknowledgementDocumentDetail: undefined,
  responseRejectionDocumentDetail: undefined,
  responseEt3FormDocumentDetail: [],
  et1SubmittedForm: {
    id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673',
    description: 'Case Details - Sunday Ayeni',
    type: 'ET1',
  },
  genericTseApplicationCollection: [
    {
      id: '124',
      value: {
        type: 'Amend response',
        applicant: Applicant.CLAIMANT,
        date: '2 May 2019',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        status: 'inProgress',
      },
    },
    {
      id: '125',
      value: {
        type: 'Amend response',
        applicant: Applicant.CLAIMANT,
        date: '3 May 2019',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        status: 'inProgress',
      },
    },
  ],
  tseApplicationStoredCollection: [
    {
      id: '133',
      value: {
        type: 'Amend response',
        applicant: Applicant.CLAIMANT,
        date: '2 May 2024',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        status: 'Stored',
      },
    },
  ],
  hearingCollection: undefined,
  sendNotificationCollection: [selectedRequestOrOrder],
  documentCollection: [
    {
      id: 'f78aa088-c223-4ca5-8e0a-42e7c33dffa5',
      value: {
        typeOfDocument: 'ET1',
        uploadedDocument: {
          document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
          document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
          document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
        },
        shortDescription: 'Case Details - Sunday Ayeni',
      },
    },
    {
      id: '3db71007-d42c-43d5-a51b-57957f78ced3',
      value: {
        typeOfDocument: 'ACAS Certificate',
        uploadedDocument: {
          document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
          document_filename: 'ET1_ACAS_CERTIFICATE_Sunday_Ayeni_R600227_21_75.pdf',
          document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
        },
        shortDescription: 'ACAS Certificate - Sunday Ayeni - R600227/21/75',
      },
    },
  ],
  bundleDocuments: [],
  representatives: [
    {
      hasMyHMCTSAccount: YesOrNo.YES,
      respondentId: '123',
    },
  ],
  multipleFlag: YesOrNo.YES,
  leadClaimant: YesOrNo.YES,
  caseStayed: YesOrNo.YES,
};
