import ClaimantEmploymentDatesController from '../../../main/controllers/ClaimantEmploymentDatesController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant employment dates Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    new ClaimantEmploymentDatesController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, expect.anything());
  });

  it('should redirect to next page when yes is selected', () => {
    const req = mockRequest({
      body: {
        areDatesOfEmploymentCorrect: YesOrNoOrNotSure.YES,
      },
    });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when no is selected', () => {
    const req = mockRequest({
      body: {
        areDatesOfEmploymentCorrect: YesOrNoOrNotSure.NO,
      },
    });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when Not Sure is selected', () => {
    const req = mockRequest({
      body: {
        areDatesOfEmploymentCorrect: YesOrNoOrNotSure.NOT_SURE,
      },
    });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should render the same page when nothing is selected', () => {
    const req = mockRequest({ body: {} });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER);

    const errors = [{ propertyName: 'areDatesOfEmploymentCorrect', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });
});
