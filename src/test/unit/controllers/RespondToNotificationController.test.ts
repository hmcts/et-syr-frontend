import RespondToNotificationController from '../../../main/controllers/RespondToNotificationController';
import { YesOrNo } from '../../../main/definitions/case';
import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Notification Controller', () => {
  const translationJsons = { ...commonJson };
  let controller: RespondToNotificationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  const mockNotifications: SendNotificationTypeItem[] = [
    {
      id: 'd416f43f-10f4-402a-bdf1-ea9012a553d7',
      value: {
        date: '15 January 2025',
        number: '1',
        notificationState: 'notStartedYet',
        respondCollection: [
          {
            id: '15bb65f2-848f-4699-b8c3-94f561435b1b',
            value: {
              date: '2 October 2025',
              from: 'Respondent',
              response: 'Test-R-1',
              copyToOtherParty: 'Yes',
              hasSupportingMaterial: 'No',
            },
          },
        ],
        sendNotificationTitle: 'Notice of hearing',
        sendNotificationLetter: YesOrNo.YES,
        sendNotificationNotify: 'Both parties',
        sendNotificationSentBy: 'Tribunal',
        sendNotificationSubject: ['Hearing'],
        sendNotificationSubjectString: 'Hearing',
        sendNotificationResponsesCount: '1',
        respondNotificationTypeCollection: [
          {
            id: '3420d7d0-8d58-4aa7-98b6-0b2e51fd4e0a',
            value: {
              state: 'notStartedYet',
              isClaimantResponseDue: 'Yes',
              respondNotificationDate: '2 October 2025',
              respondNotificationTitle: 'Test-A-2',
              respondNotificationFullName: 'Name',
              respondNotificationWhoRespond: 'Both parties',
              respondNotificationCmoOrRequest: 'Case management order',
              respondNotificationPartyToNotify: 'Both parties',
              respondNotificationUploadDocument: [
                {
                  id: '68352d84-bddc-42fd-a221-53c6f1376cf0',
                  value: {
                    uploadedDocument: {
                      document_url:
                        'http://dm-store-aat.service.core-compute-aat.internal/documents/7abfdf66-bddb-439b-8ca8-08b968ecf3de',
                      document_filename: 'Test.txt',
                      document_binary_url:
                        'http://dm-store-aat.service.core-compute-aat.internal/documents/7abfdf66-bddb-439b-8ca8-08b968ecf3de/binary',
                    },
                  },
                },
              ],
              respondNotificationResponseRequired: 'Yes',
              respondNotificationCaseManagementMadeBy: 'Legal officer',
            },
          },
        ],
        sendNotificationResponseTribunalTable: YesOrNo.YES,
      },
    },
  ];

  beforeEach(() => {
    controller = new RespondToNotificationController();
    request = mockRequestWithTranslation({}, translationJsons);
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_NOTIFICATION', () => {
      request.session.userCase.sendNotificationCollection = mockNotifications;
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_NOTIFICATION, expect.anything());
    });

    it('should redirect to NOT_FOUND page if missing itemId', () => {
      request.session.userCase.sendNotificationCollection = mockNotifications;
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
    it('should redirect to COPY_TO_OTHER_PARTY page if hasSupportingMaterial is NO', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.sendNotificationCollection = mockNotifications;
      request.session.errors = [];
      request.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      await controller.post(request, response);
      expect(request.session.userCase.responseText).toEqual('Test response');
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.NO);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_NOTIFICATION_COPY_TO_ORDER_PARTY + '?lng=en');
    });

    it('should redirect to RESPOND_TO_NOTIFICATION if nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.session.userCase.sendNotificationCollection = mockNotifications;
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
      });
      request.session.userCase.sendNotificationCollection = mockNotifications;
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
