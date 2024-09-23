import ClaimantEmploymentDatesEnterController from '../../../main/controllers/ClaimantEmploymentDatesEnterController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant employment dates enter Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    new ClaimantEmploymentDatesEnterController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER, expect.anything());
  });

  it('should render the same page when input empty', () => {
    const req = mockRequest({
      body: {
        'employmentStartDate-day': '',
        'employmentStartDate-month': '',
        'employmentStartDate-year': '',
        'employmentEndDate-day': '',
        'employmentEndDate-month': '',
        'employmentEndDate-year': '',
      },
    });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesEnterController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should have error when date more than 10 years in future', () => {
    const req = mockRequest({
      body: {
        'newJobStartDate-day': 'a',
        'newJobStartDate-month': '',
        'newJobStartDate-year': '',
        'employmentEndDate-day': '',
        'employmentEndDate-month': '',
        'employmentEndDate-year': '',
      },
    });
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantEmploymentDatesEnterController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER
    );

    const errors = [{ propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'dayRequired' }];
    expect(req.session.errors).toEqual(errors);
  });
});
