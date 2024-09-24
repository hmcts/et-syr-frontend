import ClaimantEmploymentDatesEnterController from '../../../main/controllers/ClaimantEmploymentDatesEnterController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant employment dates enter Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ClaimantEmploymentDatesEnterController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantEmploymentDatesEnterController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should render the same page when input empty', () => {
      request = mockRequest({
        body: {
          'employmentStartDate-day': '',
          'employmentStartDate-month': '',
          'employmentStartDate-year': '',
          'employmentEndDate-day': '',
          'employmentEndDate-month': '',
          'employmentEndDate-year': '',
        },
      });
      request.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should have error when date more than 10 years in future', () => {
      request = mockRequest({
        body: {
          'newJobStartDate-day': 'a',
          'newJobStartDate-month': '',
          'newJobStartDate-year': '',
          'employmentEndDate-day': '',
          'employmentEndDate-month': '',
          'employmentEndDate-year': '',
        },
      });
      request.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'dayRequired' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
