import AcasEarlyConciliationCertificateController from '../../../main/controllers/AcasEarlyConciliationCertificateController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Acas early conciliation certificate Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: AcasEarlyConciliationCertificateController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new AcasEarlyConciliationCertificateController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.NO,
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.YES,
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when yes is selected and textarea filled', () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.YES,
          et3ResponseAcasAgreeReason: 'Test',
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponseAcasAgree', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.YES,
          et3ResponseAcasAgreeReason: '1'.repeat(2501),
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponseAcasAgreeReason', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
