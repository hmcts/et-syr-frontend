import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseTypeId } from '../../../main/definitions/case';

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
