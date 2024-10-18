import ClaimantPayDetailsController from '../../../main/controllers/ClaimantPayDetailsController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant pay details Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ClaimantPayDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantPayDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAY_DETAILS, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          arePayDetailsGivenCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          arePayDetailsGivenCorrect: YesOrNoOrNotApplicable.NO,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          arePayDetailsGivenCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER);
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAY_DETAILS + languages.ENGLISH_URL_PARAMETER);

      const errors = [{ propertyName: 'arePayDetailsGivenCorrect', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
