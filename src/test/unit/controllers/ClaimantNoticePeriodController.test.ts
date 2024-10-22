import ClaimantNoticePeriodController from '../../../main/controllers/ClaimantNoticePeriodController';

import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant notice period Controller', () => {
  let controller: ClaimantNoticePeriodController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantNoticePeriodController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_PERIOD, expect.anything());
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponseIsNoticeCorrect = YesOrNoOrNotSure.NO;
      request.session.userCase.et3ResponseCorrectNoticeDetails = 'Test';
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseIsNoticeCorrect).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseCorrectNoticeDetails).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsNoticeCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsNoticeCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponseCorrectNoticeDetails: '1'.repeat(500),
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when Not Sure is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsNoticeCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsNoticeCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponseCorrectNoticeDetails: '1'.repeat(501),
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
      const errors = [{ propertyName: 'et3ResponseCorrectNoticeDetails', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
