import EmployersContractClaimController from '../../../main/controllers/EmployersContractClaimController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Employer’s contract claim Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: EmployersContractClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new EmployersContractClaimController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          doesRespondentWantToMakeECC: YesOrNo.YES,
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          doesRespondentWantToMakeECC: YesOrNo.NO,
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'doesRespondentWantToMakeECC', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
