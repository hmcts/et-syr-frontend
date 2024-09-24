import ClaimantAverageWeeklyWorkHoursController from '../../../main/controllers/ClaimantAverageWeeklyWorkHoursController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant average weekly work hours Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    new ClaimantAverageWeeklyWorkHoursController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, expect.anything());
  });

  it('should redirect to next page when yes is selected', () => {
    const req = mockRequest({
      body: {
        areWorkHourCorrect: YesOrNoOrNotSure.YES,
      },
    });
    req.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantAverageWeeklyWorkHoursController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when no is selected', () => {
    const req = mockRequest({
      body: {
        areWorkHourCorrect: YesOrNoOrNotSure.NO,
        whatAreWorkHour: 'Test',
      },
    });
    req.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantAverageWeeklyWorkHoursController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when Not Sure is selected', () => {
    const req = mockRequest({
      body: {
        areWorkHourCorrect: YesOrNoOrNotSure.NOT_SURE,
      },
    });
    req.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantAverageWeeklyWorkHoursController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should render the same page when nothing is selected', () => {
    const req = mockRequest({ body: {} });
    req.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantAverageWeeklyWorkHoursController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
    );

    const errors = [{ propertyName: 'areWorkHourCorrect', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });
});
