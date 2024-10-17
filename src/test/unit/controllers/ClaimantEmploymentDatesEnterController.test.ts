import ClaimantEmploymentDatesEnterController from '../../../main/controllers/ClaimantEmploymentDatesEnterController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

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
    it('should redirect to the next page when input empty', async () => {
      request = mockRequest({
        body: {
          'et3ResponseEmploymentStartDate-day': '',
          'et3ResponseEmploymentStartDate-month': '',
          'et3ResponseEmploymentStartDate-year': '',
          'et3ResponseEmploymentEndDate-day': '',
          'et3ResponseEmploymentEndDate-month': '',
          'et3ResponseEmploymentEndDate-year': '',
        },
      });
      request.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING);
    });

    it.each([
      {
        length: 2,
        body: {
          'et3ResponseEmploymentStartDate-day': 'test',
          'et3ResponseEmploymentStartDate-month': 'test',
          'et3ResponseEmploymentStartDate-year': 'test',
          'et3ResponseEmploymentEndDate-day': 'test',
          'et3ResponseEmploymentEndDate-month': 'test',
          'et3ResponseEmploymentEndDate-year': 'test',
        },
        errors: [
          { propertyName: 'et3ResponseEmploymentStartDate', fieldName: 'day', errorType: 'dayNotANumber' },
          { propertyName: 'et3ResponseEmploymentEndDate', fieldName: 'day', errorType: 'dayNotANumber' },
        ],
      },
      {
        length: 2,
        body: {
          'et3ResponseEmploymentStartDate-day': '',
          'et3ResponseEmploymentStartDate-month': '',
          'et3ResponseEmploymentStartDate-year': '1',
          'et3ResponseEmploymentEndDate-day': '1',
          'et3ResponseEmploymentEndDate-month': '',
          'et3ResponseEmploymentEndDate-year': '',
        },
        errors: [
          { propertyName: 'et3ResponseEmploymentStartDate', fieldName: 'day', errorType: 'dayRequired' },
          { propertyName: 'et3ResponseEmploymentEndDate', fieldName: 'month', errorType: 'monthRequired' },
        ],
      },
      {
        length: 2,
        body: {
          'et3ResponseEmploymentStartDate-day': '32',
          'et3ResponseEmploymentStartDate-month': '1',
          'et3ResponseEmploymentStartDate-year': '2000',
          'et3ResponseEmploymentEndDate-day': '1',
          'et3ResponseEmploymentEndDate-month': '13',
          'et3ResponseEmploymentEndDate-year': '2000',
        },
        errors: [
          { propertyName: 'et3ResponseEmploymentStartDate', fieldName: 'day', errorType: 'dayInvalid' },
          { propertyName: 'et3ResponseEmploymentEndDate', fieldName: 'month', errorType: 'monthInvalid' },
        ],
      },
      {
        length: 1,
        body: {
          'et3ResponseEmploymentStartDate-day': '1',
          'et3ResponseEmploymentStartDate-month': '1',
          'et3ResponseEmploymentStartDate-year': `${new Date().getFullYear() + 1}`,
          'et3ResponseEmploymentEndDate-day': '2',
          'et3ResponseEmploymentEndDate-month': '2',
          'et3ResponseEmploymentEndDate-year': `${new Date().getFullYear() + 1}`,
        },
        errors: [
          { propertyName: 'et3ResponseEmploymentStartDate', fieldName: 'day', errorType: 'invalidDateInFuture' },
        ],
      },
      {
        length: 1,
        body: {
          'et3ResponseEmploymentStartDate-day': '2',
          'et3ResponseEmploymentStartDate-month': '1',
          'et3ResponseEmploymentStartDate-year': '2024',
          'et3ResponseEmploymentEndDate-day': '1',
          'et3ResponseEmploymentEndDate-month': '1',
          'et3ResponseEmploymentEndDate-year': '2024',
        },
        errors: [
          {
            propertyName: 'et3ResponseEmploymentEndDate',
            fieldName: 'day',
            errorType: 'invalidEndDateBeforeStartDate',
          },
        ],
      },
    ])('should return appropriate errors for invalid employment dates', async ({ length, body, errors }) => {
      request = mockRequest({ body });
      request.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER);
      expect(request.session.errors).toHaveLength(length);
      expect(request.session.errors).toEqual(errors);
    });
  });
});
