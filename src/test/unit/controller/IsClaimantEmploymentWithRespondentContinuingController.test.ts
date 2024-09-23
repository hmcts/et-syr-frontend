import IsClaimantEmploymentWithRespondentContinuingController from '../../../main/controllers/IsClaimantEmploymentWithRespondentContinuingController';
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
    new IsClaimantEmploymentWithRespondentContinuingController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      expect.anything()
    );
  });

  it('should redirect to next page when yes is selected', () => {
    const req = mockRequest({
      body: {
        isEmploymentContinuing: YesOrNoOrNotSure.YES,
      },
    });
    req.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new IsClaimantEmploymentWithRespondentContinuingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to next page when no is selected', () => {
    const req = mockRequest({
      body: {
        isEmploymentContinuing: YesOrNoOrNotSure.NO,
      },
    });
    req.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new IsClaimantEmploymentWithRespondentContinuingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to next page when Not Sure is selected', () => {
    const req = mockRequest({
      body: {
        isEmploymentContinuing: YesOrNoOrNotSure.NOT_SURE,
      },
    });
    req.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new IsClaimantEmploymentWithRespondentContinuingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', () => {
    const req = mockRequest({ body: {} });
    req.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new IsClaimantEmploymentWithRespondentContinuingController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );

    const errors = [{ propertyName: 'isEmploymentContinuing', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });
});
