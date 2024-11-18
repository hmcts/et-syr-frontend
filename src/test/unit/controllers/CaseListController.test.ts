import axios from 'axios';
import _ from 'lodash';

import CaseListController from '../../../main/controllers/CaseListController';
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
  const caseListController = new CaseListController();
  const response = mockResponse();
  const request = mockRequest({ t });
  request.session.user = mockUserDetails;
  it('should render respondent replies page', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList));
    await caseListController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_LIST, expect.anything());
  });
  it('should render respondent replies page with accepted user case', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataAcceptedResponseList));
    await caseListController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_LIST, expect.anything());
  });
  it('should render respondent replies page with accepted and valid user id user case', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(
        Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataAcceptedValidRespondentIdResponseList)
      );
    await caseListController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_LIST, expect.anything());
  });
  it('should render respondent replies page with accepted and valid user id blank et3Status user case', async () => {
    const expectedValue = _.cloneDeep(
      MockAxiosResponses.mockAxiosResponseWithCaseApiDataAcceptedValidRespondentIdResponseList
    );
    expectedValue.data[0].case_data.respondentCollection[0].value.et3Status = undefined;
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest.fn().mockResolvedValueOnce(Promise.resolve(expectedValue));
    await caseListController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_LIST, expect.anything());
  });
  it('should render respondent replies page with accepted and valid user id completed et3Status user case', async () => {
    const expectedValue = _.cloneDeep(
      MockAxiosResponses.mockAxiosResponseWithCaseApiDataAcceptedValidRespondentIdResponseList
    );
    expectedValue.data[0].case_data.respondentCollection[0].value.et3Status = 'completed';
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest.fn().mockResolvedValueOnce(Promise.resolve(expectedValue));
    await caseListController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_LIST, expect.anything());
  });
  it('should throw error when not able to get user cases', async () => {
    getCaseApiMock.mockReturnValue(api);
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
    });
    const apiForMockingException = new CaseApi(mockedAxios);
    getCaseApiMock.mockReturnValue(apiForMockingException);
    await expect(caseListController.get(request, response)).rejects.toEqual(
      new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
    );
  });
});
