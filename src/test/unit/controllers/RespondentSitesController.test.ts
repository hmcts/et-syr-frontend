import RespondentSitesController from '../../../main/controllers/RespondentSitesController';
import { YesOrNoOrNotApplicable } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-sites.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/utils/ET3Util');

describe('RespondentSitesController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentSitesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentSitesController();
    request = mockRequest({});
    response = mockResponse();

    translationMock = {
      yes: 'Yes',
      no: 'No',
      notSure: 'Not sure',
      hint: 'Does the respondent operate on multiple sites?',
    };
  });

  describe('GET method', () => {
    it('should render the Respondent Sites page with the correct form content', async () => {
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SITES, expect.anything());

      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      // Test the radio button options and labels
      expect(form.fields.et3ResponseMultipleSites.values[0].label(translationMock)).toBe('Yes');
      expect(form.fields.et3ResponseMultipleSites.values[1].label(translationMock)).toBe('No');
      expect(form.fields.et3ResponseMultipleSites.values[2].label(translationMock)).toBe('Not sure');
      expect(form.fields.et3ResponseMultipleSites.hint(translationMock)).toBe(
        'Does the respondent operate on multiple sites?'
      );
    });

    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SITES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to the next page when "yes" is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseMultipleSites: YesOrNoOrNotApplicable.YES,
        },
      });
      request.url = PageUrls.RESPONDENT_SITES;

      await controller.post(request, response);
      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_SITE_EMPLOYEES
      );
    });

    it('should redirect to the next page when "no" is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseMultipleSites: YesOrNoOrNotApplicable.NO,
        },
      });
      request.url = PageUrls.RESPONDENT_SITES;

      await controller.post(request, response);
      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_SITE_EMPLOYEES
      );
    });

    it('should redirect to the next page when "not sure" is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseMultipleSites: YesOrNoOrNotApplicable.NOT_APPLICABLE,
        },
      });
      request.url = PageUrls.RESPONDENT_SITES;

      await controller.post(request, response);
      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_SITE_EMPLOYEES
      );
    });
  });
});
