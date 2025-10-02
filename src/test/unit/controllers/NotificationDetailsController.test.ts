import NotificationDetailsController from '../../../main/controllers/NotificationDetailsController';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Notification Details Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: NotificationDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new NotificationDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);

    it('should render the page NOTIFICATION_DETAILS', async () => {
      request = mockRequestWithTranslation({}, translationJsons);
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      request.session.userCase.sendNotificationCollection = mockSendNotificationCollection;
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTIFICATION_DETAILS, expect.anything());
    });

    it('should redirect to NOT_FOUND page if missing itemId', async () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.sendNotificationCollection = mockSendNotificationCollection;
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if application invalid', async () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.sendNotificationCollection = undefined;
      request.params.itemId = '1';
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });
});
