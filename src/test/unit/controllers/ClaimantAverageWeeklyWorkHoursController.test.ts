import ClaimantAverageWeeklyWorkHoursController from '../../../main/controllers/ClaimantAverageWeeklyWorkHoursController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

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
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS
      );
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotApplicable.NO,
          et3ResponseClaimantCorrectHours: '168',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS
      );
    });

    it('should redirect to next page when no is selected but hour invalid', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotApplicable.NO,
          et3ResponseClaimantCorrectHours: 'Test',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
      const errors = [{ propertyName: 'et3ResponseClaimantCorrectHours', errorType: 'invalid' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when no is selected but hour exceeded', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotApplicable.NO,
          et3ResponseClaimantCorrectHours: '169',
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
      const errors = [{ propertyName: 'et3ResponseClaimantCorrectHours', errorType: 'exceeded' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when Not Sure is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS
      );
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS
      );
    });
  });
});
