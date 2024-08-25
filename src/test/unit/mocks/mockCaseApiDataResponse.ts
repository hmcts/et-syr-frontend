import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseTypeId } from '../../../main/definitions/case';
import { HubLinkStatus } from '../../../main/definitions/hub';

export const MockCaseApiDataResponseConstants = {
  TEST_SUBMISSION_REFERENCE_NUMBER: '1234567890123456',
  TEST_RESPONDENT_NAME: 'Test Respondent Name',
  TEST_CLAIMANT_NAME: 'Test Claimant Name',
  TEST_CLAIMANT_SURNAME: 'Test Claimant Surname',
};

export const mockCaseApiDataResponseForSelfAssignment = <CaseApiDataResponse>{
  id: MockCaseApiDataResponseConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  case_type_id: CaseTypeId.ENGLAND_WALES,
  created_date: '2022-08-19T09:19:25.79202',
  last_modified: '2022-08-19T09:19:25.817549',
  state: undefined,
  case_data: {
    respondentCollection: [
      {
        id: 'test',
        value: {
          respondent_name: MockCaseApiDataResponseConstants.TEST_RESPONDENT_NAME,
        },
      },
    ],
    claimantIndType: {
      claimant_first_names: MockCaseApiDataResponseConstants.TEST_CLAIMANT_NAME,
      claimant_last_name: MockCaseApiDataResponseConstants.TEST_CLAIMANT_SURNAME,
    },
  },
};

export const mockCaseApiDataResponse = <CaseApiDataResponse>{
  id: MockCaseApiDataResponseConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  case_type_id: CaseTypeId.ENGLAND_WALES,
  created_date: '2022-08-19T09:19:25.79202',
  last_modified: '2022-08-19T09:19:25.817549',
  state: undefined,
  case_data: {
    respondentCollection: [
      {
        id: 'test',
        value: {
          respondent_name: MockCaseApiDataResponseConstants.TEST_RESPONDENT_NAME,
        },
      },
    ],
    claimantIndType: {
      claimant_first_names: MockCaseApiDataResponseConstants.TEST_CLAIMANT_NAME,
      claimant_last_name: MockCaseApiDataResponseConstants.TEST_CLAIMANT_SURNAME,
    },
    hubLinksStatuses: {
      documents: HubLinkStatus.READY_TO_VIEW,
      et1ClaimForm: HubLinkStatus.READY_TO_VIEW,
      hearingDetails: HubLinkStatus.READY_TO_VIEW,
      tribunalOrders: HubLinkStatus.READY_TO_VIEW,
      contactTribunal: HubLinkStatus.READY_TO_VIEW,
      respondentResponse: HubLinkStatus.READY_TO_VIEW,
      tribunalJudgements: HubLinkStatus.READY_TO_VIEW,
      respondentApplications: HubLinkStatus.READY_TO_VIEW,
      requestsAndApplications: HubLinkStatus.READY_TO_VIEW,
    },
  },
};
