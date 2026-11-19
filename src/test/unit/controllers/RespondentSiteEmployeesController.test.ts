import RespondentSiteEmployeesController from '../../../main/controllers/RespondentSiteEmployeesController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { getCuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-site-employees.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');
jest.mock('../../../main/modules/featureFlag/CuiYourSupportFeature');

describe('RespondentSiteEmployeesController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentSiteEmployeesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const isEnabled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new RespondentSiteEmployeesController();
    request = mockRequest({});
    response = mockResponse();
    (getCuiYourSupportFeature as jest.Mock).mockReturnValue({ isEnabled });
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SITE_EMPLOYEES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should continue to the hearing preferences CYA when CUI Your Support is disabled', async () => {
      isEnabled.mockResolvedValue(false);
      request = mockRequest({
        body: {
          et3ResponseSiteEmploymentCount: '25',
        },
      });
      request.url = PageUrls.RESPONDENT_SITE_EMPLOYEES;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(), // Form object
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES
      );
    });

    it('should insert Your Support before the hearing preferences CYA when CUI is enabled', async () => {
      isEnabled.mockResolvedValue(true);
      request = mockRequest({
        body: {
          et3ResponseSiteEmploymentCount: '25',
        },
      });
      request.url = `${PageUrls.RESPONDENT_SITE_EMPLOYEES}${languages.WELSH_URL_PARAMETER}`;

      await controller.post(request, response);

      expect(request.session.subSectionUrl).toBe(
        `${PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES}${languages.WELSH_URL_PARAMETER}`
      );
      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.YOUR_SUPPORT
      );
    });

    it('should not stage the CYA destination when saving for later', async () => {
      isEnabled.mockResolvedValue(true);
      request = mockRequest({ body: { saveForLater: 'true' } });

      await controller.post(request, response);

      expect(request.session.subSectionUrl).toBeUndefined();
    });
  });
});
