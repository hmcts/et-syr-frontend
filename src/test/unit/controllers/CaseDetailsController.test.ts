import CaseDetailsController from '../../../main/controllers/CaseDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { LoadUserCaseResults, loadUserCaseFromApi } from '../../../main/helpers/LoadUserCaseHelper';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
jest.mock('../../../main/helpers/LoadUserCaseHelper', () => ({
  ...jest.requireActual('../../../main/helpers/LoadUserCaseHelper'),
  loadUserCaseFromApi: jest.fn(),
}));

const loadUserCaseFromApiMock = loadUserCaseFromApi as jest.MockedFunction<typeof loadUserCaseFromApi>;

describe('CaseDetailsController', () => {
  const t = {
    common: {},
  };
  const caseDetailsController = new CaseDetailsController();
  const response = mockResponse();
  const request = mockRequest({ t });

  beforeEach(() => {
    loadUserCaseFromApiMock.mockResolvedValue(LoadUserCaseResults.LOADED);
    jest.clearAllMocks();
  });

  it('should render respondent replies page', async () => {
    loadUserCaseFromApiMock.mockImplementationOnce(async req => {
      req.session.userCase = mockCaseWithIdWithRespondents;
      return LoadUserCaseResults.LOADED;
    });
    request.session.user = mockUserDetails;
    request.session.selectedRespondentIndex = 0;
    request.params = { caseSubmissionReference: '1234', ccdId: '3453xaa' };
    await caseDetailsController.get(request, response);

    expect(loadUserCaseFromApiMock).toHaveBeenCalledWith(request, response, '1234', '3453xaa');
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.anything()
    );
  });

  it('should redirect to transferred case page when transfer info is available', async () => {
    loadUserCaseFromApiMock.mockResolvedValueOnce(LoadUserCaseResults.TRANSFERRED);
    request.session.user = mockUserDetails;
    request.params = { caseSubmissionReference: '1234', ccdId: 'ccd-1' };

    await caseDetailsController.get(request, response);

    expect(loadUserCaseFromApiMock).toHaveBeenCalledWith(request, response, '1234', 'ccd-1');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to not found when case access fails and case is not transferred', async () => {
    loadUserCaseFromApiMock.mockResolvedValueOnce(LoadUserCaseResults.FAILED);
    request.session.user = mockUserDetails;
    request.url = '/case-details/1234/ccd-1?lng=en';
    request.params = { caseSubmissionReference: '1234', ccdId: 'ccd-1' };

    await caseDetailsController.get(request, response);

    expect(loadUserCaseFromApiMock).toHaveBeenCalledWith(request, response, '1234', 'ccd-1');
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
  });
});
