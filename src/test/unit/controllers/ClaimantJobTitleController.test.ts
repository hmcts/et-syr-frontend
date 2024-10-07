import ClaimantJobTitleController from '../../../main/controllers/ClaimantJobTitleController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant job title Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
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
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_JOB_TITLE, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          isClaimantJobTitleCorrect: YesOrNoOrNotSure.YES,
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          isClaimantJobTitleCorrect: YesOrNoOrNotSure.NO,
          whatIsClaimantJobTitle: 'Test',
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when No is selected but text exceeds 100 characters', () => {
      request = mockRequest({
        body: {
          isClaimantJobTitleCorrect: YesOrNoOrNotSure.NO,
          whatIsClaimantJobTitle: '1'.repeat(101),
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'whatIsClaimantJobTitle', errorType: 'invalid-length' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          isClaimantJobTitleCorrect: YesOrNoOrNotSure.NOT_SURE,
        },
      });
      request.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);

      const errors = [{ propertyName: 'isClaimantJobTitleCorrect', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
