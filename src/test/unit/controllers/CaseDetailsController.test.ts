import axios from 'axios';

import CaseDetailsController from '../../../main/controllers/CaseDetailsController';
import { ServiceErrors, TranslationKeys } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockAxiosError } from '../mocks/mockAxios';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');

describe('Case list controller', () => {
  const t = {
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
  const api = new CaseApi(axios);
  const caseDetailsController = new CaseDetailsController();
  const response = mockResponse();
  const request = mockRequest({ t });
  it('should render respondent replies page', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCase = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
    request.session.user = mockUserDetails;
    request.session.user.id = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';
    request.session.selectedRespondentIndex = 0;
    await caseDetailsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.anything()
    );
  });
  it('should throw error when not able to get user case', async () => {
    getCaseApiMock.mockReturnValue(api);
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockImplementation(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
    });
    const apiForMockingException = new CaseApi(mockedAxios);
    getCaseApiMock.mockReturnValue(apiForMockingException);
    await caseDetailsController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
