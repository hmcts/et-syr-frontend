import { CaseTypeId, CaseWithId } from '../../../main/definitions/case';
import { DefaultValues } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mapRespondent } from '../../../main/helpers/ApiFormatter';

import { MockCaseWithIdConstants } from './mockCaseWithId';
import { mockEt3RespondentType } from './mockEt3Respondent';

export const mockValidCaseWithIdWithFullRespondentDetails = <CaseWithId>{
  createdDate: DefaultValues.STRING_EMPTY,
  lastModified: DefaultValues.STRING_EMPTY,
  state: undefined,
  caseTypeId: CaseTypeId.ENGLAND_WALES,
  id: MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  respondentName: MockCaseWithIdConstants.TEST_RESPONDENT_NAME,
  firstName: MockCaseWithIdConstants.TEST_CLAIMANT_NAME,
  lastName: MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME,
  typeOfClaim: [TypesOfClaim.DISCRIMINATION],
  respondents: [mapRespondent(mockEt3RespondentType)],
};
