import RespondentResponseLandingController from '../../../main/controllers/RespondentResponseLandingController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent response landing controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should render the Respondent Response Landing for ET3', async () => {
    const controller = new RespondentResponseLandingController();
    const response = mockResponse();
    const request = mockRequest({});

    // No statuses set
    request.session.userCase.et3HubLinksStatuses = {};

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_RESPONSE_LANDING, expect.anything());
  });
});
