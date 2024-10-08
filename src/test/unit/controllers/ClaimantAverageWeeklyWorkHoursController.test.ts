import ClaimantAverageWeeklyWorkHoursController from '../../../main/controllers/ClaimantAverageWeeklyWorkHoursController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant average weekly work hours Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ClaimantAverageWeeklyWorkHoursController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantAverageWeeklyWorkHoursController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          areClaimantWorkHourCorrect: YesOrNoOrNotSure.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          areClaimantWorkHourCorrect: YesOrNoOrNotSure.NO,
          whatAreClaimantCorrectWorkHour: '168',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected but hour invalid', () => {
      request = mockRequest({
        body: {
          areClaimantWorkHourCorrect: YesOrNoOrNotSure.NO,
          whatAreClaimantCorrectWorkHour: 'Test',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'whatAreClaimantCorrectWorkHour', errorType: 'invalid' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when no is selected but hour exceeded', () => {
      request = mockRequest({
        body: {
          areClaimantWorkHourCorrect: YesOrNoOrNotSure.NO,
          whatAreClaimantCorrectWorkHour: '169',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'whatAreClaimantCorrectWorkHour', errorType: 'exceeded' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          areClaimantWorkHourCorrect: YesOrNoOrNotSure.NOT_SURE,
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'areClaimantWorkHourCorrect', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
