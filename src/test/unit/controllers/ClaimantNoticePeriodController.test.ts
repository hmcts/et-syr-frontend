import ClaimantNoticePeriodController from '../../../main/controllers/ClaimantNoticePeriodController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant notice period Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
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
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_NOTICE_PERIOD, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          areClaimantNoticePeriodDetailsCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          areClaimantNoticePeriodDetailsCorrect: YesOrNoOrNotApplicable.NO,
          whatAreClaimantCorrectNoticeDetails: 'Test',
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          areClaimantNoticePeriodDetailsCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER);

      const errors = [{ propertyName: 'areClaimantNoticePeriodDetailsCorrect', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', () => {
      request = mockRequest({
        body: {
          areClaimantNoticePeriodDetailsCorrect: YesOrNoOrNotApplicable.NO,
          whatAreClaimantCorrectNoticeDetails: '1'.repeat(2501),
        },
      });
      request.url = PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_NOTICE_PERIOD + languages.ENGLISH_URL_PARAMETER);

      const errors = [{ propertyName: 'whatAreClaimantCorrectNoticeDetails', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
