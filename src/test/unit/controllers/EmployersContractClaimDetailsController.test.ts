import EmployersContractClaimDetailsController from '../../../main/controllers/EmployersContractClaimDetailsController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Employer’s contract claim details Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: EmployersContractClaimDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new EmployersContractClaimDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when details is inputted', () => {
      request = mockRequest({
        body: {
          et3ResponseContestClaimDetails: 'Test',
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when text exceeds 2500 characters', () => {
      request = mockRequest({
        body: {
          et3ResponseContestClaimDetails: '1'.repeat(2501),
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponseContestClaimDetails', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponseContestClaimDetails', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
