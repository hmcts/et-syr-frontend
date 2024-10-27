import axios from 'axios';

import CaseNumberCheckController from '../../../main/controllers/CaseNumberCheckController';
import { LegacyUrls, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Case number check controller', () => {
  const t = {
    common: {},
  };

  it('should render the Case Number Check Form', () => {
    const request = mockRequest({ t });
    request.session.caseNumberChecked = false;
    const response = mockResponse();
    request.session.userCase = mockValidCaseWithId;
    new CaseNumberCheckController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_NUMBER_CHECK, expect.anything());
  });
  describe('post()', () => {
    it('should forward to legacy url when case reference check is string false', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithStringFalseResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.ET3);
    });
    it('should forward to et3 self form assignment when case reference check is string true', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithStringTrueResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM + languages.ENGLISH_URL_PARAMETER);
    });
    it('should forward to legacy url when case reference check is boolean false', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithBooleanFalseResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.ET3);
    });
    it('should forward to et3 self form assignment when case reference check is boolean true', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithBooleanTrueResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM + languages.ENGLISH_URL_PARAMETER);
    });
    it('should add session error to request when system error occurs', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest.fn().mockImplementationOnce(() => {
        throw new Error('session error');
      });
      await new CaseNumberCheckController().post(request, response);
      expect(request.session.errors).toHaveLength(1);
      expect(response.redirect).toHaveBeenCalledWith(request.url);
    });
    it('should add session error to request when form field error occurs', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      request.body.ethosCaseReference = undefined;
      getCaseApiMock.mockReturnValue(api);
      await new CaseNumberCheckController().post(request, response);
      expect(request.session.errors).toHaveLength(1);
      expect(response.redirect).toHaveBeenCalledWith(request.url);
    });
  });
});
