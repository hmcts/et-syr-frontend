import NewSelfAssignmentRequestController from '../../../main/controllers/NewSelfAssignmentRequestController';
import { DefaultValues, PageUrls } from '../../../main/definitions/constants';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('New self assignment request controller test', () => {
  const t = {
    common: {},
  };

  it('should forward to self assignment form page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = mockValidCaseWithId;
    new NewSelfAssignmentRequestController().get(request, response);
    expect(request.session.userCase.id).toEqual(DefaultValues.STRING_EMPTY);
    expect(request.session.userCase.createdDate).toEqual(DefaultValues.STRING_EMPTY);
    expect(request.session.userCase.lastModified).toEqual(DefaultValues.STRING_EMPTY);
    expect(request.session.userCase.state).toEqual(undefined);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
    expect(request.session.userCase.firstName).toEqual(DefaultValues.STRING_EMPTY);
    expect(request.session.userCase.lastName).toEqual(DefaultValues.STRING_EMPTY);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM);
  });
});
