import ClaimantJobTitleController from '../../../main/controllers/ClaimantJobTitleController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant job title Controller', () => {
  let controller: ClaimantJobTitleController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantJobTitleController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_JOB_TITLE, expect.anything());
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponseIsJobTitleCorrect = YesOrNoOrNotApplicable.NO;
      request.session.userCase.et3ResponseCorrectJobTitle = 'Test';
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseIsJobTitleCorrect).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseCorrectJobTitle).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsJobTitleCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsJobTitleCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponseCorrectJobTitle: 'Test',
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
    });

    it('should render the same page when No is selected but text exceeds 100 characters', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsJobTitleCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponseCorrectJobTitle: '1'.repeat(101),
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE);
      const errors = [{ propertyName: 'et3ResponseCorrectJobTitle', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when Not Sure is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseIsJobTitleCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_JOB_TITLE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
    });
  });
});
