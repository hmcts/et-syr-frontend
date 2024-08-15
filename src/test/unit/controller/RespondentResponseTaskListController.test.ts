import RespondentResponseTaskListController from '../../../main/controllers/RespondentResponseTaskListController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent Response Task List Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockLdClient.mockClear();
    mockWelshFlag.mockClear();
  });

  it('should render the Respondent Response Task List with sections for ET3', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, expect.anything());
  });

  it('should handle when Welsh language feature flag is disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new RespondentResponseTaskListController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST,
      expect.objectContaining({
        welshEnabled: false,
      })
    );
  });
});
