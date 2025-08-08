import ClaimantPayDetailsController from '../../../main/controllers/ClaimantPayDetailsController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Claimant pay details Controller', () => {
  let controller: ClaimantPayDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantPayDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PAY_DETAILS, expect.anything());
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponseEarningDetailsCorrect = YesOrNoOrNotApplicable.NO;
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseEarningDetailsCorrect).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEarningDetailsCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should redirect to next page when no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEarningDetailsCorrect: YesOrNoOrNotApplicable.NO,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAY_DETAILS_ENTER);
    });

    it('should redirect to next page when Not Sure is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEarningDetailsCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });

    it('should redirect to next page when CYA and yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEarningDetailsCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.session.returnUrl = PageUrls.CHECK_YOUR_ANSWERS_ET3 + languages.ENGLISH_URL_PARAMETER;
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_ET3 + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to next page when CYA and no is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEarningDetailsCorrect: YesOrNoOrNotApplicable.NO,
        },
      });
      request.session.returnUrl = PageUrls.CHECK_YOUR_ANSWERS_ET3 + languages.ENGLISH_URL_PARAMETER;
      request.url = PageUrls.CLAIMANT_PAY_DETAILS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAY_DETAILS_ENTER);
    });
  });
});
