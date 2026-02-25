import { YesOrNo } from '../../../../main/definitions/case';
import { SendNotificationType } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesRespond } from '../../../../main/definitions/constants';
import { LinkStatus } from '../../../../main/definitions/links';
import {
  getNotificationContent,
  getNotificationResponses,
  getNotificationStatusAfterViewed,
  getSinglePseResponseDisplay,
  isRespondButton,
} from '../../../../main/helpers/controller/NotificationDetailsControllerHelper';
import commonJsonRaw from '../../../../main/resources/locales/en/translation/common.json';
import notificationDetailsJson from '../../../../main/resources/locales/en/translation/notification-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockSendNotificationCollection } from '../../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../../mocks/mockUser';
import mockUserCase from '../../mocks/mockUserCase';

describe('NotificationDetailsControllerHelper', () => {
  const translations = {
    ...notificationDetailsJson,
    ...commonJsonRaw,
  };

  describe('getNotificationStatusAfterViewed', () => {
    const user = mockUserDetails;

    it('returns undefined if notification is missing', () => {
      expect(getNotificationStatusAfterViewed(undefined, user)).toBeUndefined();
    });

    it('returns undefined if user is missing', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, undefined)).toBeUndefined();
    });

    it('returns undefined if user has existing state', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondentState: [
          {
            id: '1',
            value: {
              userIdamId: user.id,
              notificationState: LinkStatus.SUBMITTED,
            },
          },
        ],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, undefined)).toBeUndefined();
    });

    it('returns VIEWED if parties respond not required', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBe(LinkStatus.VIEWED);
    });

    it('returns NOT_STARTED_YET if parties respond required but user has not viewed', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBe(LinkStatus.NOT_STARTED_YET);
    });

    it('returns VIEWED if parties respond required and user has responded', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondCollection: [
          {
            id: '1',
            value: {
              fromIdamId: user.id,
            },
          },
        ],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBe(LinkStatus.VIEWED);
    });
  });

  describe('getNotificationContent', () => {
    const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
    const baseItem: SendNotificationType = {
      date: '2 October 2025',
      number: '1',
      sendNotificationTitle: 'Noti-Test-1',
      sendNotificationLetter: YesOrNo.NO,
      sendNotificationNotify: 'Both parties',
      sendNotificationSentBy: 'Tribunal',
      sendNotificationSubject: ['Claimant / Respondent details'],
      sendNotificationSubjectString: 'Claimant / Respondent details',
      sendNotificationResponsesCount: '0',
      sendNotificationWhoMadeJudgement: 'Judge',
      sendNotificationResponseTribunalTable: YesOrNo.YES,
    };

    it('returns basic summary rows', () => {
      const result = getNotificationContent(baseItem, req);
      expect(result).toHaveLength(4);
      expect(result[0].key.text).toEqual('Notification Subject');
      expect(result[0].value.text).toEqual('Claimant / Respondent details');
      expect(result[1].key.text).toEqual('Date sent');
      expect(result[1].value.text).toEqual('2 October 2025');
      expect(result[2].key.text).toEqual('Sent by');
      expect(result[2].value.text).toEqual('Tribunal');
      expect(result[3].key.text).toEqual('Sent to');
      expect(result[3].value.text).toEqual('Both parties');
    });

    it('includes order/request and response due if case management present', () => {
      const item: SendNotificationType = {
        ...baseItem,
        sendNotificationSubject: ['Case management orders / requests'],
        sendNotificationFullName: 'Test Name',
        sendNotificationWhoCaseOrder: 'Legal officer',
        sendNotificationSelectParties: 'Both parties',
        sendNotificationCaseManagement: 'Case management order',
        sendNotificationResponseTribunal: 'Yes - view document for details',
      };
      const result = getNotificationContent(item, req);
      expect(result).toHaveLength(9);
      expect(result[3].key.text).toEqual('Case management order or request?');
      expect(result[3].value.text).toEqual('Case management order');
      expect(result[4].key.text).toEqual('Response due');
      expect(result[4].value.text).toEqual('Yes - view document for details');
      expect(result[5].key.text).toEqual('Party or parties to respond');
      expect(result[5].value.text).toEqual('Both parties');
      expect(result[6].key.text).toEqual('Case management order made by');
      expect(result[6].value.text).toEqual('Legal officer');
      expect(result[7].key.text).toEqual('Name');
      expect(result[7].value.text).toEqual('Test Name');
    });

    it('includes request made by and full name if request made by present', () => {
      const item: SendNotificationType = {
        ...baseItem,
        sendNotificationSubject: ['Case management orders / requests'],
        sendNotificationFullName: 'Test Name',
        sendNotificationRequestMadeBy: 'Caseworker',
        sendNotificationCaseManagement: 'Request',
        sendNotificationResponseTribunal: 'No',
      };
      const result = getNotificationContent(item, req);
      expect(result).toHaveLength(8);
      expect(result[3].key.text).toEqual('Case management order or request?');
      expect(result[3].value.text).toEqual('Request');
      expect(result[4].key.text).toEqual('Response due');
      expect(result[4].value.text).toEqual('No');
      expect(result[5].key.text).toEqual('Request made by');
      expect(result[5].value.text).toEqual('Caseworker');
      expect(result[6].key.text).toEqual('Name');
      expect(result[6].value.text).toEqual('Test Name');
    });

    it('includes additional info if present', () => {
      const item: SendNotificationType = {
        ...baseItem,
        sendNotificationAdditionalInfo: 'Test Additional information 5',
      };
      const result = getNotificationContent(item, req);
      expect(result).toHaveLength(5);
      expect(result[3].key.text).toEqual('Additional information');
      expect(result[3].value.text).toEqual('Test Additional information 5');
    });

    it('includes letter if present', () => {
      const item: SendNotificationType = {
        ...baseItem,
        sendNotificationLetter: YesOrNo.YES,
        sendNotificationUploadDocument: [
          {
            id: '1875343a-1753-4df5-abaa-e487126f6cbd',
            value: {
              shortDescription: 'Test Short description',
              uploadedDocument: {
                document_url: 'http://dummy/documents/00adf2f4-5fd0-4811-9597-cae66058e98e',
                document_filename: 'Test.pdf',
                document_binary_url: 'http://dummy/documents/00adf2f4-5fd0-4811-9597-cae66058e98e/binary',
              },
            },
          },
        ],
      };
      const result = getNotificationContent(item, req);
      expect(result).toHaveLength(6);
      expect(result[3].key.text).toEqual('Description');
      expect(result[3].value.text).toEqual('Test Short description');
      expect(result[4].key.text).toEqual('Document');
      expect(result[4].value.text).toEqual(undefined);
    });
  });

  describe('getNotificationResponses', () => {
    const mockUser = mockUserDetails;
    const mockReq = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
    mockReq.session.user = mockUser;

    it('returns empty array if notification is undefined', () => {
      expect(getNotificationResponses(undefined, mockReq)).toEqual([]);
    });

    it('returns empty array if respondCollection and respondNotificationTypeCollection are missing', () => {
      expect(getNotificationResponses({}, mockReq)).toEqual([]);
    });

    it('returns responses for matching respondCollection items', () => {
      const notification: SendNotificationType = {
        respondCollection: mockSendNotificationCollection[0].value.respondCollection,
      };
      const result = getNotificationResponses(notification, mockReq);
      expect(result).toHaveLength(1);
      expect(result[0].rows).toHaveLength(5);
      expect(result[0].rows[0].key.text).toEqual('Response from');
      expect(result[0].rows[0].value.text).toEqual('Respondent');
      expect(result[0].rows[1].key.text).toEqual('Response date');
      expect(result[0].rows[1].value.text).toEqual('2 October 2025');
      expect(result[0].rows[2].key.text).toEqual('What is your response to the tribunal?');
      expect(result[0].rows[2].value.text).toEqual('Rep-Response-1');
      expect(result[0].rows[3].key.text).toEqual('Supporting material');
      expect(result[0].rows[3].value.html).toEqual(
        '<a href="/getSupportingMaterial/bac9bb00-3602-4ac3-8848-118df0703f0f" target="_blank">Test.pdf</a><br>'
      );
      expect(result[0].rows[4].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[0].rows[4].value.text).toEqual('Yes');
    });

    it('returns responses for matching respondNotificationTypeCollection items', () => {
      const notification: SendNotificationType = {
        respondNotificationTypeCollection: mockSendNotificationCollection[0].value.respondNotificationTypeCollection,
      };
      const result = getNotificationResponses(notification, mockReq);
      expect(result).toHaveLength(1);
      expect(result[0].rows).toHaveLength(12);
      expect(result[0].rows[0].key.text).toEqual('Response');
      expect(result[0].rows[0].value.text).toEqual('T-Response-1');
      expect(result[0].rows[1].key.text).toEqual('Response date');
      expect(result[0].rows[1].value.text).toEqual('2 October 2025');
      expect(result[0].rows[2].key.text).toEqual('Sent by');
      expect(result[0].rows[2].value.text).toEqual('Tribunal');
      expect(result[0].rows[3].key.text).toEqual('Case management order or request?');
      expect(result[0].rows[3].value.text).toEqual('Case management order');
      expect(result[0].rows[4].key.text).toEqual('Response due');
      expect(result[0].rows[4].value.text).toEqual('Yes');
      expect(result[0].rows[5].key.text).toEqual('Party or parties to respond');
      expect(result[0].rows[5].value.text).toEqual('Both parties');
      expect(result[0].rows[6].key.text).toEqual('Additional information');
      expect(result[0].rows[6].value.text).toEqual('Test Additional information A1');
      expect(result[0].rows[7].key.text).toEqual('Description');
      expect(result[0].rows[7].value.text).toEqual('Test Short description A1');
      expect(result[0].rows[8].key.text).toEqual('Document');
      expect(result[0].rows[8].value.html).toEqual(
        '<a href="/getSupportingMaterial/2654b6b1-4877-49ea-9bd2-15a0727809c6" target="_blank">Test.pdf</a><br>'
      );
      expect(result[0].rows[9].key.text).toEqual('Request made by');
      expect(result[0].rows[9].value.text).toEqual('Legal officer');
      expect(result[0].rows[10].key.text).toEqual('Name');
      expect(result[0].rows[10].value.text).toEqual('Test Name');
      expect(result[0].rows[11].key.text).toEqual('Sent to');
      expect(result[0].rows[11].value.text).toEqual('Both parties');
    });

    it('sorts responses by date', () => {
      const notification: SendNotificationType = {
        respondCollection: [
          {
            id: '1',
            value: { date: '1 October 2025', copyToOtherParty: YesOrNo.YES, dateTime: '2025-10-02T12:00:00' },
          },
          { id: '2', value: { date: '4 October 2025', copyToOtherParty: YesOrNo.YES, fromIdamId: mockUser.id } },
        ],
        respondNotificationTypeCollection: [
          {
            id: '3',
            value: {
              respondNotificationDate: '3 October 2025',
              respondNotificationPartyToNotify: 'Both parties',
            },
          },
        ],
      };
      const result = getNotificationResponses(notification, mockReq);
      expect(result[0].date).toEqual(new Date('2025-10-02T12:00:00.000'));
      expect(result[1].date).toEqual(new Date('2025-10-03T00:00:00.000'));
      expect(result[2].date).toEqual(new Date('2025-10-04T00:00:00.000'));
    });
  });

  describe('isRespondButton', () => {
    const user = mockUserDetails;

    it('returns false if user has already responded', () => {
      const notification: SendNotificationType = {
        respondCollection: [
          {
            id: '1',
            value: { date: '4 October 2025', copyToOtherParty: YesOrNo.YES, fromIdamId: mockUserDetails.id },
          },
        ],
        respondNotificationTypeCollection: [
          {
            id: '3',
            value: {
              respondNotificationDate: '3 October 2025',
              respondNotificationPartyToNotify: 'Both parties',
            },
          },
        ],
      };
      const result = isRespondButton(undefined, notification, user);
      expect(result).toBe(false);
    });

    it('returns true if user has not responded and state is NOT_STARTED_YET', () => {
      const notificationNoResponse: SendNotificationType = {
        respondNotificationTypeCollection: [
          {
            id: '3',
            value: {
              respondNotificationDate: '3 October 2025',
              respondNotificationPartyToNotify: 'Both parties',
            },
          },
        ],
      };
      const result = isRespondButton(LinkStatus.NOT_STARTED_YET, notificationNoResponse, user);
      expect(result).toBe(true);
    });

    it('returns false if user has not responded and state is not NOT_STARTED_YET', () => {
      const notificationNoResponse: SendNotificationType = {
        respondNotificationTypeCollection: [
          {
            id: '3',
            value: {
              respondNotificationDate: '3 October 2025',
              respondNotificationPartyToNotify: 'Both parties',
            },
          },
        ],
      };
      const result = isRespondButton(LinkStatus.NOT_VIEWED, notificationNoResponse, user);
      expect(result).toBe(false);
    });
  });

  describe('getSinglePseResponseDisplay', () => {
    it('returns basic summary rows', () => {
      const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      const result = getSinglePseResponseDisplay(
        mockSendNotificationCollection[0].value.respondentRespondStoredCollection[0].value,
        req
      );
      expect(result).toHaveLength(5);
      expect(result[0].key.text).toEqual('Response from');
      expect(result[0].value.text).toEqual('Respondent');
      expect(result[1].key.text).toEqual('Response date');
      expect(result[1].value.text).toEqual('3 October 2025');
      expect(result[2].key.text).toEqual('What is your response to the tribunal?');
      expect(result[2].value.text).toEqual('Rep-Response-Stored-1');
      expect(result[3].key.text).toEqual('Supporting material');
      expect(result[3].value.html).toEqual(
        '<a href="/getSupportingMaterial/7ccbb009-0f45-4441-a3cb-8f6b9c60a7e0" target="_blank">Test.pdf</a><br>'
      );
      expect(result[4].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[4].value.text).toEqual('Yes');
    });
  });
});
