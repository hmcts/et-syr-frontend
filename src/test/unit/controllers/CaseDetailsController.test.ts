import axios from 'axios';

import CaseDetailsController from '../../../main/controllers/CaseDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { handleTransferredCaseRedirect } from '../../../main/helpers/CaseTransferHelper';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
jest.mock('../../../main/helpers/CaseTransferHelper', () => ({
  handleTransferredCaseRedirect: jest.fn(),
  buildTransferredCaseRedirectUrl: jest.fn(),
  resolveTransferredCasePartyNames: jest.fn(),
  getNoAccessBody: jest.fn(),
}));

const handleTransferredCaseRedirectMock = handleTransferredCaseRedirect as jest.MockedFunction<
  typeof handleTransferredCaseRedirect
>;

describe('Case list controller', () => {
  const t = {
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
  const api = new CaseApi(axios);
  const caseDetailsController = new CaseDetailsController();
  const response = mockResponse();
  const request = mockRequest({ t });

  beforeEach(() => {
    handleTransferredCaseRedirectMock.mockResolvedValue(false);
    jest.clearAllMocks();
  });

  it('should render respondent replies page', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCase = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
    request.session.user = mockUserDetails;
    request.session.user.id = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';
    request.session.selectedRespondentIndex = 0;
    request.params = { ccdId: 'test' };
    await caseDetailsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.anything()
    );
  });

  it('should redirect to transferred case page when transfer info is available', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCase = jest.fn().mockRejectedValueOnce(new Error('Error getting user case: status code 500'));
    handleTransferredCaseRedirectMock.mockResolvedValueOnce(true);
    request.session.user = mockUserDetails;
    request.params = { caseSubmissionReference: '1234', ccdId: 'ccd-1' };

    await caseDetailsController.get(request, response);

    expect(handleTransferredCaseRedirectMock).toHaveBeenCalledWith(request, response, '1234', 'ccd-1');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to transferred case page when case is transferred to ECM', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCase = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM')
      );
    request.session.user = mockUserDetails;
    request.url = '/case-details/1234/ccd-1?lng=en';
    request.params = { caseSubmissionReference: '1234', ccdId: 'ccd-1' };

    await caseDetailsController.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.TRANSFERRED_CASE + '?lng=en');
  });
});
