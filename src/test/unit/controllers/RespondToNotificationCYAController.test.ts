import RespondToNotificationCYAController from '../../../main/controllers/RespondToNotificationCYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import contactTribunalCYAJson from '../../../main/resources/locales/en/translation/contact-tribunal-check-your-answers.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Notification CYA Controller', () => {
  let controller: RespondToNotificationCYAController;
  let request: ReturnType<typeof mockRequestWithTranslation>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToNotificationCYAController();
    request = mockRequestWithTranslation({}, { ...applicationTypeJson, ...contactTribunalCYAJson });
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_NOTIFICATION_CYA', () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.selectedNotification = mockSendNotificationCollection[0];
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_NOTIFICATION_CYA, expect.anything());
    });
  });
});
