import ClaimantPayDetailsEnterController from '../../../main/controllers/ClaimantPayDetailsEnterController';
import { HowOften } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant pay details enter details Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
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
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when radio is selected', () => {
      request = mockRequest({
        body: {
          howOftenClaimantPaid: HowOften.WEEKLY,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS_ENTER + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER);
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS_ENTER + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'howOftenClaimantPaid', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
