import ClaimantAverageWeeklyWorkHoursController from '../../../main/controllers/ClaimantAverageWeeklyWorkHoursController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant average weekly work hours Controller', () => {
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
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
        expect.anything()
      );
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponseClaimantWeeklyHours = YesOrNoOrNotSure.NO;
      request.session.userCase.et3ResponseClaimantCorrectHours = 'Test';
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseClaimantWeeklyHours).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseClaimantCorrectHours).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotSure.YES,
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
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotSure.NO,
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
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotSure.NO,
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
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotSure.NO,
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
          et3ResponseClaimantWeeklyHours: YesOrNoOrNotSure.NOT_SURE,
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
