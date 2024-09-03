import axios from 'axios';

import RespondentCaseListCheckController from '../../../main/controllers/RespondentCaseListCheckController';
import { PageUrls, ServiceErrors, languages } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockAxiosError } from '../mocks/mockAxios';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
jest.mock('axios');
const api = new CaseApi(axios);
const respondentCaseListCheckController = new RespondentCaseListCheckController();

describe('Respondent Case List Check controller', () => {
  it('should call response.redirect with /respondent-replies url', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList));
    await respondentCaseListCheckController.get(request, response);
    expect(response.redirect).toHaveBeenCalledTimes(1);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CASE_LIST);
  });
  it('should call response.redirect with /respondent-replies url in welsh language', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/test?lng=cy';
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList));
    await respondentCaseListCheckController.get(request, response);
    expect(response.redirect).toHaveBeenCalledTimes(1);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CASE_LIST + languages.WELSH_URL_PARAMETER);
  });
  it('should call response.redirect with /self-assignment-form url', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await respondentCaseListCheckController.get(request, response);
    expect(response.redirect).toHaveBeenCalledTimes(1);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM);
  });
  it('should call response.redirect with /self-assignment-form url in welsh language', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/test?lng=cy';
    getCaseApiMock.mockReturnValue(api);
    api.getUserCases = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await respondentCaseListCheckController.get(request, response);
    expect(response.redirect).toHaveBeenCalledTimes(1);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM + languages.WELSH_URL_PARAMETER);
  });
  it('should throw error when there is a problem while getting user cases', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
    });
    const apiForMockingException = new CaseApi(mockedAxios);
    getCaseApiMock.mockReturnValue(apiForMockingException);
    await expect(respondentCaseListCheckController.get(request, response)).rejects.toEqual(
      new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
    );
  });
});
