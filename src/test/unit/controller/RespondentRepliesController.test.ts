import axios from 'axios';

import RespondentCaseListController from '../../../main/controllers/RespondentCaseListController';
import { ServiceErrors, TranslationKeys } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockAxiosError } from '../mocks/mockAxios';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');

describe('Respondent Replies list controller', () => {
  const t = {
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
  const api = new CaseApi(axios);
  const respondentRepliesController = new RespondentCaseListController();
  it('should render respondent replies page', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList));
    await respondentRepliesController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_CASE_LIST, expect.anything());
  });
  it('should throw error when not able to get user cases', async () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    getCaseApiMock.mockReturnValue(api);
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
    });
    const apiForMockingException = new CaseApi(mockedAxios);
    getCaseApiMock.mockReturnValue(apiForMockingException);
    await expect(respondentRepliesController.get(request, response)).rejects.toEqual(
      new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
    );
  });
});
