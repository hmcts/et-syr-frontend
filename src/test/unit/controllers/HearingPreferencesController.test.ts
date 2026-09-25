import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { PageUrls } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { getCuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/CuiYourSupportFeature');
jest.mock('../../../main/utils/ET3Util');

describe('HearingPreferencesController', () => {
  const isEnabled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ET3Util.updateET3ResponseWithET3Form as jest.Mock).mockReset();
    (getCuiYourSupportFeature as jest.Mock).mockReturnValue({ isEnabled });
  });

  it('continues to respondent employees when CUI Your Support is enabled', async () => {
    isEnabled.mockResolvedValue(true);
    const controller = new HearingPreferencesController();
    const request = mockRequest({});
    const response = mockResponse();

    await controller.post(request, response);

    expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_EMPLOYEES
    );
  });

  it('continues to reasonable adjustments when CUI Your Support is disabled', async () => {
    isEnabled.mockResolvedValue(false);
    const controller = new HearingPreferencesController();
    const request = mockRequest({});
    const response = mockResponse();

    await controller.post(request, response);

    expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.REASONABLE_ADJUSTMENTS
    );
  });
});
