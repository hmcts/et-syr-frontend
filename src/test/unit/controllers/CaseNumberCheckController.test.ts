import axios from 'axios';

import CaseNumberCheckController from '../../../main/controllers/CaseNumberCheckController';
import { DefaultValues, LegacyUrls, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
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
    expect(request.session.isSelfAssignment).toBe(false);
  });
  it('should render the Case Number Check  Form and set request session isSelfAssignment parameter to true when req.body has redirect of self assignment', () => {
    const request = mockRequest({ t });
    request.query = {
      redirect: DefaultValues.SELF_ASSIGNMENT,
    };
    request.session.caseNumberChecked = false;
    const response = mockResponse();
    request.session.userCase = mockValidCaseWithId;
    new CaseNumberCheckController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CASE_NUMBER_CHECK, expect.anything());
    expect(request.session.isSelfAssignment).toBe(true);
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
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.SIGN_UP);
    });
    it('should forward to checklist controller when case reference check is string true', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithStringTrueResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECKLIST + languages.ENGLISH_URL_PARAMETER);
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
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.SIGN_UP);
    });
    it('should forward to checklist controller when case reference check is boolean true', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.checkEthosCaseReference = jest
        .fn()
        .mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithBooleanTrueResponse);
      await new CaseNumberCheckController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECKLIST + languages.ENGLISH_URL_PARAMETER);
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
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK);
    });
    it('should add session error to request when form field error occurs', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      request.body.ethosCaseReference = undefined;
      getCaseApiMock.mockReturnValue(api);
      await new CaseNumberCheckController().post(request, response);
      expect(request.session.errors).toHaveLength(1);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK);
    });
  });
});
