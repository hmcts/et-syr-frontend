import ClaimantsApplicationsController from '../../../main/controllers/ClaimantsApplicationsController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Claimants Applications Controller', () => {
  let controller: ClaimantsApplicationsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantsApplicationsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);

    it('should render the page CLAIMANTS_APPLICATIONS', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, expect.anything());
    });

    it('should redirect to holding page if feature flag is disabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.HOLDING_PAGE + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
