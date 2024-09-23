import ClaimantEmploymentDatesController from '../../../main/controllers/ClaimantEmploymentDatesController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant employment dates Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  const controller = new ClaimantEmploymentDatesController();

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, expect.anything());
  });

  it('should redirect to next page when yes is selected', () => {
    const body = { areDatesOfEmploymentCorrect: YesOrNoOrNotSure.YES };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when no is selected', () => {
    const body = { areDatesOfEmploymentCorrect: YesOrNoOrNotSure.NO };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when Not Sure is selected', () => {
    const body = { areDatesOfEmploymentCorrect: YesOrNoOrNotSure.NOT_SURE };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should render the same page when nothing is selected', () => {
    const body = { continue: true };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER;

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES + languages.ENGLISH_URL_PARAMETER);

    const errors = [{ propertyName: 'areDatesOfEmploymentCorrect', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });
});
