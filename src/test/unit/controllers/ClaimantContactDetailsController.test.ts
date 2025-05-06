import ClaimantContactDetailsController from '../../../main/controllers/ClaimantContactDetailsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Claimant Contact Details Controller', () => {
  let controller: ClaimantContactDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantContactDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);

    it('should render the page CLAIMANT_CONTACT_DETAILS', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_CONTACT_DETAILS, expect.anything());
    });
  });
});
