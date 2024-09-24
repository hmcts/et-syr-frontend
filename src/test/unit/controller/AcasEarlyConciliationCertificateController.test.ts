import AcasEarlyConciliationCertificateController from '../../../main/controllers/AcasEarlyConciliationCertificateController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Acas early conciliation certificate Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    new AcasEarlyConciliationCertificateController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      expect.anything()
    );
  });

  it('should redirect to next page when no is selected', () => {
    const req = mockRequest({
      body: {
        disagreeEarlyConciliation: YesOrNo.NO,
      },
    });
    req.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new AcasEarlyConciliationCertificateController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to next page when yes is selected', () => {
    const req = mockRequest({
      body: {
        disagreeEarlyConciliation: YesOrNo.YES,
      },
    });
    req.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new AcasEarlyConciliationCertificateController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to next page when yes is selected and textarea filled', () => {
    const req = mockRequest({
      body: {
        disagreeEarlyConciliation: YesOrNo.YES,
        disagreeEarlyConciliationWhy: 'Test',
      },
    });
    req.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new AcasEarlyConciliationCertificateController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', () => {
    const req = mockRequest({ body: {} });
    req.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new AcasEarlyConciliationCertificateController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER
    );

    const errors = [{ propertyName: 'disagreeEarlyConciliation', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the same page when No is selected but summary text exceeds 2500 characters', () => {
    const req = mockRequest({
      body: {
        disagreeEarlyConciliation: YesOrNo.YES,
        disagreeEarlyConciliationWhy: '1'.repeat(2501),
      },
    });
    req.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new AcasEarlyConciliationCertificateController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER
    );

    const errors = [{ propertyName: 'disagreeEarlyConciliationWhy', errorType: 'tooLong' }];
    expect(req.session.errors).toEqual(errors);
  });
});
