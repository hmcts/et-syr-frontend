import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
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
import { Applicant, TYPE_OF_CLAIMANT } from '../../../main/definitions/constants';
import {
  CaseState,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  TellUsWhatYouWant,
} from '../../../main/definitions/definition';
import { HubLinkStatus, HubLinksStatuses } from '../../../main/definitions/hub';
import { ET3CaseDetailsLinksStatuses, ET3HubLinksStatuses } from '../../../main/definitions/links';

export const mockedApiData: CaseApiDataResponse = {
  id: '1234',
  case_type_id: CaseTypeId.ENGLAND_WALES,
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  created_date: '2022-08-19T09:19:25.79202',
  last_modified: '2022-08-19T09:19:25.817549',
  case_data: {
    preAcceptCase: undefined,
    ethosCaseReference: '123456/2022',
    feeGroupReference: '1234',
    caseType: CaseType.SINGLE,
    claimantRepresentedQuestion: YesOrNo.YES,
    claimantWorkAddressQuestion: YesOrNo.YES,
    claimant_TypeOfClaimant: TYPE_OF_CLAIMANT,
    typesOfClaim: ['discrimination', 'payRelated'],
    ClaimantPcqId: '1234',
    et3ResponseReceived: true,
    claimantIndType: {
      claimant_first_names: 'Jane',
      claimant_last_name: 'Doe',
      claimant_date_of_birth: '2022-10-05',
      claimant_sex: Sex.MALE,
      claimant_preferred_title: 'Mr',
    },
    claimantType: {
      claimant_email_address: 'janedoe@exmaple.com',
      claimant_contact_preference: EmailOrPost.EMAIL,
      claimant_phone_number: '075',
      claimant_addressUK: {
        AddressLine1: 'address 1',
        AddressLine2: 'address 2',
        PostTown: 'Test',
        PostCode: 'TEST',
        Country: 'United',
      },
    },
    claimantOtherType: {
      pastEmployer: YesOrNo.YES,
      stillWorking: StillWorking.WORKING,
      claimant_occupation: 'Developer',
      claimant_employed_from: '2010-05-11',
      claimant_employed_to: '2017-05-11',
      claimant_notice_period: YesOrNo.YES,
      claimant_notice_period_unit: WeeksOrMonths.WEEKS,
      claimant_notice_period_duration: '1',
      claimant_average_weekly_hours: 5,
      claimant_pay_before_tax: 123,
      claimant_pay_after_tax: 120,
      claimant_pay_cycle: PayInterval.WEEKS,
      claimant_pension_contribution: YesOrNoOrNotApplicable.YES,
      claimant_pension_weekly_contribution: 15,
      claimant_benefits: YesOrNo.YES,
      claimant_benefits_detail: 'Some benefits',
      claimant_employed_notice_period: '2022-08-11',
    },
    newEmploymentType: {
      new_job: YesOrNo.YES,
      newly_employed_from: '2010-05-12',
      new_pay_before_tax: 4000,
      new_job_pay_interval: PayInterval.MONTHS,
    },
    claimantHearingPreference: {
      reasonable_adjustments: YesOrNo.YES,
      reasonable_adjustments_detail: 'Adjustments detail test',
      hearing_preferences: [HearingPreference.PHONE],
      hearing_assistance: 'Hearing assistance test',
      contact_language: EnglishOrWelsh.ENGLISH,
      hearing_language: EnglishOrWelsh.ENGLISH,
    },
    claimantRequests: {
      claim_outcome: [TellUsWhatYouWant.COMPENSATION_ONLY],
      claimant_compensation_text: 'Compensation outcome',
      claimant_compensation_amount: 123,
      claimant_tribunal_recommendation: 'Tribunal recommendation request',
      whistleblowing: YesOrNo.YES,
      whistleblowing_authority: 'Whistleblowing entity name',
      linked_cases: YesOrNo.YES,
      linked_cases_detail: 'Linked Cases Detail',
      claim_description: 'Claim summary text',
      claim_description_document: {
        document_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c',
        document_filename: 'document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/a0c113ec-eede-472a-a59c-f2614b48177c/binary',
      },
      discrimination_claims: [ClaimTypeDiscrimination.RACE],
      pay_claims: [ClaimTypePay.REDUNDANCY_PAY],
      other_claim: 'other type of claims',
    },
    claimantTaskListChecks: {
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
    },
    claimantWorkAddress: {
      claimant_work_address: {
        AddressLine1: 'Respondent Address',
        AddressLine2: 'That Road',
        PostTown: 'Anytown',
        Country: 'England',
        PostCode: 'SW1H 9AQ',
      },
    },
    respondentCollection: [
      {
        value: {
          responseReceived: YesOrNo.YES,
          respondent_name: 'Globo Corp',
          respondent_ACAS_question: YesOrNo.YES,
          respondent_ACAS: 'R111111111111',
          respondent_ACAS_no: NoAcasNumberReason.ANOTHER,
          respondent_address: {
            AddressLine1: 'Respondent Address',
            AddressLine2: 'That Road',
            PostTown: 'Anytown',
            Country: 'England',
            PostCode: 'SW1H 9AQ',
          },
          idamId: '1234',
          et3HubLinksStatuses: new ET3HubLinksStatuses(),
          et3CaseDetailsLinksStatuses: new ET3CaseDetailsLinksStatuses(),
        },
        id: '3453xaa',
      },
      {
        value: {
          respondent_name: 'Version1',
          respondent_ACAS_question: YesOrNo.YES,
          respondent_ACAS: 'R111111111112',
          respondent_ACAS_no: NoAcasNumberReason.ANOTHER,
          respondent_address: {
            AddressLine1: 'Ad1',
            AddressLine2: 'Ad2',
            PostTown: 'Town2',
            Country: 'Country2',
            PostCode: 'SW1A 1AA',
          },
        },
        id: '3454xaa',
      },
    ],
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
    receiptDate: '2022-10-03',
    hubLinksStatuses: new HubLinksStatuses(),
    managingOffice: 'Leeds',
    tribunalCorrespondenceEmail: 'leedsoffice@gov.co.uk',
    tribunalCorrespondenceTelephone: '0300 123 1024',
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
    sendNotificationCollection: [
      {
        id: '123',
        value: {
          number: '1',
          sendNotificationTitle: 'title',
          sendNotificationSelectHearing: {
            selectedLabel: 'Hearing',
          },
          date: '2019-05-03',
          sentBy: 'Tribunal',
          sendNotificationSubjectString: 'Case management orders / requests',
          sendNotificationCaseManagement: 'Order',
          sendNotificationResponseTribunal: 'required',
          sendNotificationSelectParties: 'Both',
          sendNotificationAdditionalInfo: 'additional info',
          sendNotificationWhoCaseOrder: 'Legal officer',
          sendNotificationFullName: 'Judge Dredd',
          sendNotificationNotify: 'Both',
          notificationState: HubLinkStatus.NOT_VIEWED,
        },
      },
    ],
    repCollection: [
      {
        value: {
          myHmctsYesNo: YesOrNo.YES,
          respondentId: '123',
        },
        id: '123',
      },
    ],
    multipleFlag: YesOrNo.YES,
    leadClaimant: YesOrNo.YES,
    batchCaseStayed: YesOrNo.YES,
  },
};
