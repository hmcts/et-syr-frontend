import { ET3ModificationTypes } from '../../../main/definitions/constants';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../mocks/mockCaseWithIdWithFullRespondentDetails';
import { ET3ExpectedRequest } from '../mocks/mockEt3ExpectedRequest';

const idamId = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';

describe('ET3DataModelUtil tests', () => {
  test('Should convert CaseWithId to convertCaseWithIdToET3Request', async () => {
    const et3Request = ET3DataModelUtil.convertCaseWithIdToET3Request(
      mockValidCaseWithIdWithFullRespondentDetails,
      idamId,
      ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
      ET3CaseDetailsLinkNames.RespondentResponse,
      LinkStatus.IN_PROGRESS,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS
    );
    expect(et3Request.caseSubmissionReference).toEqual(ET3ExpectedRequest.CASE_ID);
    expect(et3Request.caseTypeId).toEqual(ET3ExpectedRequest.CASE_TYPE);
    expect(et3Request.requestType).toEqual(ET3ExpectedRequest.REQUEST_TYPE);
    expect(et3Request.respondent).toEqual(ET3ExpectedRequest.RESPONDENT);
  });
});
