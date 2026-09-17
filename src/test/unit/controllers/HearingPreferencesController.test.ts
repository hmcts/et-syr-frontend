import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { returnNextPage } from '../../../main/helpers/RouterHelpers';
import { getCuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/CuiYourSupportFeature');
jest.mock('../../../main/utils/ET3Util');

describe('HearingPreferencesController', () => {
  const getSupportPageUrl = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ET3Util.updateET3ResponseWithET3Form as jest.Mock).mockReset();
    (getCuiYourSupportFeature as jest.Mock).mockReturnValue({ getSupportPageUrl });
  });

  it('stages the hearing preferences check answers return URL for the CUI support flow', async () => {
    getSupportPageUrl.mockResolvedValue(PageUrls.YOUR_SUPPORT);
    const controller = new HearingPreferencesController();
    const request = mockRequest({});
    const response = mockResponse();
    request.url = `${PageUrls.HEARING_PREFERENCES}${languages.WELSH_URL_PARAMETER}`;
    (ET3Util.updateET3ResponseWithET3Form as jest.Mock).mockImplementation(
      (req, res, _form, _linkName, _linkStatus, redirectUrl) => returnNextPage(req, res, redirectUrl)
    );

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    expect(request.session.subSectionUrl).toBe(
      `${PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES}${languages.WELSH_URL_PARAMETER}`
    );
    expect(request.session.returnUrl).toBeUndefined();
    expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.YOUR_SUPPORT
    );
  });

  it('does not set a return URL for the legacy support flow', async () => {
    getSupportPageUrl.mockResolvedValue(PageUrls.REASONABLE_ADJUSTMENTS);
    const controller = new HearingPreferencesController();
    const request = mockRequest({});

    await controller.post(request, mockResponse());

    expect(request.session.subSectionUrl).toBeUndefined();
  });

  it('preserves an existing return URL', async () => {
    getSupportPageUrl.mockResolvedValue(PageUrls.YOUR_SUPPORT);
    const controller = new HearingPreferencesController();
    const request = mockRequest({ session: { returnUrl: PageUrls.CHECK_YOUR_ANSWERS_ET3 } });

    await controller.post(request, mockResponse());

    expect(request.session.returnUrl).toBe(PageUrls.CHECK_YOUR_ANSWERS_ET3);
    expect(request.session.subSectionUrl).toBeUndefined();
  });

  it('does not set a return URL when saving for later', async () => {
    getSupportPageUrl.mockResolvedValue(PageUrls.YOUR_SUPPORT);
    const controller = new HearingPreferencesController();
    const request = mockRequest({ body: { saveForLater: 'true' } });

    await controller.post(request, mockResponse());

    expect(request.session.subSectionUrl).toBeUndefined();
  });
});
