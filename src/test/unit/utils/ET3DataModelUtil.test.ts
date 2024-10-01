import { ET3ModificationConstants } from '../../../main/definitions/constants';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../mocks/mockCaseWithIdWithFullRespondentDetails';
import { ET3ExpectedRequest } from '../mocks/mockEt3ExpectedRequest';

const idamId = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';

describe('ET3DataModelUtil tests', () => {
  test('Should convert CaseWithId to convertCaseWithIdToET3Request', async () => {
    const et3Request = ET3DataModelUtil.convertCaseWithIdToET3Request(
      mockValidCaseWithIdWithFullRespondentDetails,
      idamId,
      ET3ModificationConstants.MODIFICATION_TYPE_UPDATE
    );
    expect(et3Request.caseId).toEqual(ET3ExpectedRequest.CASE_ID);
    expect(et3Request.caseType).toEqual(ET3ExpectedRequest.CASE_TYPE);
    expect(et3Request.requestType).toEqual(ET3ExpectedRequest.REQUEST_TYPE);
    expect(et3Request.respondent).toEqual(ET3ExpectedRequest.RESPONDENT);
  });
});
