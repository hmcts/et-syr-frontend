import CheckYourAnswersHearingPreferencesController from '../../../main/controllers/CheckYourAnswersHearingPreferencesController';
import { TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/controller/CheckYourAnswersET3Helper');
jest.mock('../../../main/utils/ET3Util');

describe('CheckYourAnswersHearingPreferencesController', () => {
  let controller: CheckYourAnswersHearingPreferencesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  beforeEach(() => {
    controller = new CheckYourAnswersHearingPreferencesController();
    request = mockRequest({
      session: {
        userCase,
        selectedRespondent: {
          hearingPreferencesSection: 'Yes',
        },
      },
    });
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES,
        expect.anything()
      );
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to the respondent response task list on valid submission', async () => {
      request.body = {
        hearingPreferencesSection: 'Yes', // Ensure this is set
      };

      (ET3Util.updateET3Data as jest.Mock).mockResolvedValue(userCase); // Mock the ET3 update function

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(userCase); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith('/respondent-response-task-list'); // Ensure the correct redirect occurs
    });
  });
});
