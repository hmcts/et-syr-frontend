import axios from 'axios';

import ClaimantPayDetailsEnterController from '../../../main/controllers/ClaimantPayDetailsEnterController';
import { PayFrequency } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant pay details enter details Controller', () => {
  let controller: ClaimantPayDetailsEnterController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantPayDetailsEnterController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
      const api = new CaseApi(axios);
      getCaseApiMock.mockReturnValue(api);
      api.getUserCase = jest
        .fn()
        .mockReturnValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER, expect.anything());
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponsePayFrequency = PayFrequency.WEEKLY;
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponsePayFrequency).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when radio is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponsePayFrequency: PayFrequency.WEEKLY,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS_ENTER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS_ENTER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should redirect to error page when et3ResponsePayBeforeTax is invalid', async () => {
      request = mockRequest({
        body: {
          et3ResponsePayBeforeTaxInput: 'Test',
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAY_DETAILS_ENTER);
    });
  });
});
