import ClaimantPensionAndBenefitsController from '../../../main/controllers/ClaimantPensionAndBenefitsController';

import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant pension and benefits Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ClaimantPensionAndBenefitsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantPensionAndBenefitsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponsePensionCorrectDetails: '1'.repeat(400),
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when Not Sure is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PENSION_AND_BENEFITS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponsePensionCorrectDetails: '1'.repeat(401),
        },
      });
      request.url = PageUrls.CLAIMANT_PENSION_AND_BENEFITS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
      const errors = [{ propertyName: 'et3ResponsePensionCorrectDetails', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
