import { CaseWithId } from '../../../main/definitions/case';
import { DefaultValues } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';

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
