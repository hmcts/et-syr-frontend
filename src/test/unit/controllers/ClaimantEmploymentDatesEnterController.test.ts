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
    it('should redirect to the next page when input empty', () => {
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

    it.each([
      {
        length: 2,
        body: {
          'employmentStartDate-day': 'test',
          'employmentStartDate-month': 'test',
          'employmentStartDate-year': 'test',
          'employmentEndDate-day': 'test',
          'employmentEndDate-month': 'test',
          'employmentEndDate-year': 'test',
        },
        errors: [
          { propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'dayNotANumber' },
          { propertyName: 'employmentEndDate', fieldName: 'day', errorType: 'dayNotANumber' },
        ],
      },
      {
        length: 2,
        body: {
          'employmentStartDate-day': '',
          'employmentStartDate-month': '',
          'employmentStartDate-year': '1',
          'employmentEndDate-day': '1',
          'employmentEndDate-month': '',
          'employmentEndDate-year': '',
        },
        errors: [
          { propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'dayRequired' },
          { propertyName: 'employmentEndDate', fieldName: 'month', errorType: 'monthRequired' },
        ],
      },
      {
        length: 2,
        body: {
          'employmentStartDate-day': '32',
          'employmentStartDate-month': '1',
          'employmentStartDate-year': '2000',
          'employmentEndDate-day': '1',
          'employmentEndDate-month': '13',
          'employmentEndDate-year': '2000',
        },
        errors: [
          { propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'dayInvalid' },
          { propertyName: 'employmentEndDate', fieldName: 'month', errorType: 'monthInvalid' },
        ],
      },
      {
        length: 1,
        body: {
          'employmentStartDate-day': '31',
          'employmentStartDate-month': '12',
          'employmentStartDate-year': `${new Date().getFullYear() + 1}`,
          'employmentEndDate-day': '',
          'employmentEndDate-month': '',
          'employmentEndDate-year': '',
        },
        errors: [{ propertyName: 'employmentStartDate', fieldName: 'day', errorType: 'invalidDateInFuture' }],
      },
    ])('should return appropriate errors for invalid employment dates', ({ length, body, errors }) => {
      request = mockRequest({ body });
      request.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER
      );

      expect(request.session.errors).toHaveLength(length);
      expect(request.session.errors).toEqual(errors);
    });
  });
});
