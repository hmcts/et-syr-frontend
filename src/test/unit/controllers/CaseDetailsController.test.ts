import CaseDetailsController from '../../../main/controllers/CaseDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { LoadUserCaseResults, loadUserCaseFromApi } from '../../../main/helpers/LoadUserCaseHelper';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
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
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
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

  it('should display a callback error once without redirecting to the case list', async () => {
    const req = mockRequest({
      userCase: { ...mockCaseWithIdWithRespondents },
      session: { user: mockUserDetails },
    });
    req.params = { caseSubmissionReference: '1234', ccdId: '3453xaa' };
    const callbackError = { propertyName: 'yourSupportCallback', errorType: 'failed' };
    req.session.errors = [callbackError];
    const res = mockResponse();

    await caseDetailsController.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.objectContaining({ sessionErrors: [callbackError] })
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session.errors).toEqual([]);

    const nextResponse = mockResponse();
    await caseDetailsController.get(req, nextResponse);

    expect(nextResponse.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.objectContaining({ sessionErrors: [] })
    );
  });

  it.each([false, true])(
    'should retain the case-list redirect for unrelated errors (callback error present: %s)',
    async callbackErrorPresent => {
      const req = mockRequest({
        userCase: { ...mockCaseWithIdWithRespondents },
        session: { user: mockUserDetails },
      });
      req.params = { caseSubmissionReference: '1234', ccdId: '3453xaa' };
      req.url = '/case-details/1234/3453xaa?lng=en';
      const unrelatedError = { propertyName: 'hiddenErrorField', errorType: 'api' };
      req.session.errors = callbackErrorPresent
        ? [{ propertyName: 'yourSupportCallback', errorType: 'failed' }, unrelatedError]
        : [unrelatedError];
      const res = mockResponse();

      await caseDetailsController.get(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
      expect(res.render).not.toHaveBeenCalled();
      expect(req.session.errors).toEqual([unrelatedError]);
    }
  );

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
