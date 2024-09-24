import ClaimantJobTitleController from '../../../main/controllers/ClaimantJobTitleController';
import { YesOrNoOrNotSure } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/en/translation/acas-early-conciliation-certificate.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claimant job title Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  it('should render the page', () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    new ClaimantJobTitleController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_JOB_TITLE, expect.anything());
  });

  it('should redirect to next page when yes is selected', () => {
    const req = mockRequest({
      body: {
        isClaimantJobTitleCorrect: YesOrNoOrNotSure.YES,
      },
    });
    req.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantJobTitleController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when no is selected', () => {
    const req = mockRequest({
      body: {
        isClaimantJobTitleCorrect: YesOrNoOrNotSure.NO,
        whatIsClaimantJobTitle: 'Test',
      },
    });
    req.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantJobTitleController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to next page when Not Sure is selected', () => {
    const req = mockRequest({
      body: {
        isClaimantJobTitleCorrect: YesOrNoOrNotSure.NOT_SURE,
      },
    });
    req.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantJobTitleController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should render the same page when nothing is selected', () => {
    const req = mockRequest({ body: {} });
    req.url = PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER;
    const res = mockResponse();
    new ClaimantJobTitleController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_JOB_TITLE + languages.ENGLISH_URL_PARAMETER);

    const errors = [{ propertyName: 'isClaimantJobTitleCorrect', errorType: 'required' }];
    expect(req.session.errors).toEqual(errors);
  });
});
