import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { ET3ModificationTypes } from '../../../main/definitions/constants';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { formatApiCaseDataToCaseWithId } from '../../../main/helpers/ApiFormatter';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import { mockCaseApiDataResponse } from '../mocks/mockCaseApiDataResponse';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { ET3ExpectedRequest } from '../mocks/mockEt3ExpectedRequest';
import { mockRequest } from '../mocks/mockRequest';

const idamId = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';

describe('ET3DataModelUtil tests', () => {
  test('Should convert CaseWithId to convertCaseWithIdToET3Request', async () => {
    const fromApiCaseData: CaseApiDataResponse = mockCaseApiDataResponse;
    const req: AppRequest = mockRequest({ body: mockValidCaseWithId });
    req.session.user = {
      id: 'dda9d1c3-1a11-3c3a-819e-74174fbec26b',
      familyName: 'test family name',
      givenName: 'test given name',
      isCitizen: true,
      email: 'test@test.com',
      accessToken: 'test@test.com',
    };
    const caseWithId: CaseWithId = formatApiCaseDataToCaseWithId(fromApiCaseData, req);
    const et3Request = ET3DataModelUtil.convertCaseWithIdToET3Request(
      caseWithId,
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
    expect(et3Request.caseDetailsLinksSectionId).toEqual(ET3ExpectedRequest.CASE_DETAILS_LINKS_SECTION_ID);
    expect(et3Request.caseDetailsLinksSectionStatus).toEqual(ET3ExpectedRequest.CASE_DETAILS_LINKS_SECTION_STATUS);
    expect(et3Request.responseHubLinksSectionId).toEqual(ET3ExpectedRequest.RESPONSE_HUB_LINK_SECTION_ID);
    expect(et3Request.responseHubLinksSectionStatus).toEqual(ET3ExpectedRequest.RESPONSE_HUB_LINK_SECTION_STATUS);
    expect(et3Request.respondent).toEqual(ET3ExpectedRequest.RESPONDENT);
  });
});
