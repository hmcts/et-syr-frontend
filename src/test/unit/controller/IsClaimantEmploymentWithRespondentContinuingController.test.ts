import IsClaimantEmploymentWithRespondentContinuingController from '../../../main/controllers/IsClaimantEmploymentWithRespondentContinuingController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Is the claimant’s employment with the respondent continuing? Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: IsClaimantEmploymentWithRespondentContinuingController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new IsClaimantEmploymentWithRespondentContinuingController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          isEmploymentContinuing: YesOrNoOrNotSure.YES,
        },
      });
      request.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          isEmploymentContinuing: YesOrNoOrNotSure.NO,
        },
      });
      request.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          isEmploymentContinuing: YesOrNoOrNotSure.NOT_SURE,
        },
      });
      request.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'isEmploymentContinuing', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
