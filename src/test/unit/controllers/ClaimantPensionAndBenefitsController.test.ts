import ClaimantPensionAndBenefitsController from '../../../main/controllers/ClaimantPensionAndBenefitsController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const updateET3ResponseWithET3FormMock = jest.spyOn(ET3Util, 'updateET3ResponseWithET3Form');

describe('Claimant pension and benefits Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ClaimantPensionAndBenefitsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantPensionAndBenefitsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when yes is selected', () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.YES,
        },
      });
      updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
        response.redirect(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER);
      });
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when no is selected', () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponsePensionCorrectDetails: 'Test',
        },
      });
      updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
        response.redirect(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER);
      });
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when Not Sure is selected', () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
        response.redirect(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER);
      });
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when nothing is selected', () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponseIsPensionCorrect', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', () => {
      request = mockRequest({
        body: {
          et3ResponseIsPensionCorrect: YesOrNoOrNotApplicable.NO,
          et3ResponsePensionCorrectDetails: '1'.repeat(2501),
        },
      });
      request.url = PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER;
      controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.ENGLISH_URL_PARAMETER
      );

      const errors = [{ propertyName: 'et3ResponsePensionCorrectDetails', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
