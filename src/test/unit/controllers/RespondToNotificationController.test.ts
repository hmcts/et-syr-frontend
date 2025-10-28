import RespondToNotificationController from '../../../main/controllers/RespondToNotificationController';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';

describe('Respond to Notification Controller', () => {
  const translationJsons = { ...commonJson };
  let controller: RespondToNotificationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToNotificationController();
    request = mockRequestWithTranslation({}, translationJsons);
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_NOTIFICATION', () => {
      request.session.userCase.sendNotificationCollection = mockSendNotificationCollection;
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_NOTIFICATION, expect.anything());
    });

    it('should redirect to NOT_FOUND page if missing itemId', () => {
      request.session.userCase.sendNotificationCollection = mockSendNotificationCollection;
      request.params.itemId = undefined;
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if notification undefined', () => {
      request.session.userCase.sendNotificationCollection = undefined;
      request.params.itemId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });

  describe('POST method', () => {
    it('should redirect to RESPOND_TO_NOTIFICATION_COPY page if hasSupportingMaterial is NO', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
        userCase: { et1OnlineSubmission: 'Yes', sendNotificationCollection: mockSendNotificationCollection },
      });
      request.session.errors = [];
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.post(request, response);
      expect(request.session.userCase.responseText).toEqual('Test response');
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.NO);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_NOTIFICATION_COPY + '?lng=en');
    });

    it('should redirect to RESPOND_TO_NOTIFICATION_COPY_OFFLINE page if hasSupportingMaterial is NO', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
        userCase: { sendNotificationCollection: mockSendNotificationCollection },
      });
      request.session.errors = [];
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE + '?lng=en');
    });

    it('should redirect to RESPOND_TO_NOTIFICATION if nothing is selected', async () => {
      request = mockRequest({ body: {}, userCase: { sendNotificationCollection: mockSendNotificationCollection } });
      request.session.errors = [];
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        '/respond-to-notification/d416f43f-10f4-402a-bdf1-ea9012a553d7?lng=en'
      );
      const errors = [{ propertyName: 'hasSupportingMaterial', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to RESPOND_TO_NOTIFICATION if responseText exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          responseText: '1'.repeat(2501),
          hasSupportingMaterial: YesOrNo.NO,
        },
        userCase: { sendNotificationCollection: mockSendNotificationCollection },
      });
      request.session.errors = [];
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        '/respond-to-notification/d416f43f-10f4-402a-bdf1-ea9012a553d7?lng=en'
      );
      const errors = [{ propertyName: 'responseText', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to NOT_FOUND if no selected notification is found', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.sendNotificationCollection = undefined;
      request.session.errors = [];
      request.params.itemId = '1';
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
    });
  });
});
