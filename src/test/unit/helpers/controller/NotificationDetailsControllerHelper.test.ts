import { YesOrNo } from '../../../../main/definitions/case';
import { SendNotificationType } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, PartiesRespond } from '../../../../main/definitions/constants';
import { LinkStatus } from '../../../../main/definitions/links';
import {
  getNotificationContent,
  getNotificationStatusAfterViewed,
} from '../../../../main/helpers/controller/NotificationDetailsControllerHelper';
import commonJsonRaw from '../../../../main/resources/locales/en/translation/common.json';
import notificationDetailsJson from '../../../../main/resources/locales/en/translation/notification-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockUserDetails } from '../../mocks/mockUser';

describe('NotificationDetailsControllerHelper', () => {
  describe('getNotificationStatusAfterViewed', () => {
    const user = mockUserDetails;
    user.id = 'user1';

    it('returns undefined if item is missing', () => {
      expect(getNotificationStatusAfterViewed(undefined, user)).toBeUndefined();
    });

    it('returns undefined if user is missing', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondCollection: [],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, undefined)).toBeUndefined();
    });

    it('returns NOT_STARTED_YET if parties respond required and user has responded', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondCollection: [
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: user.id,
            },
          },
        ],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBeUndefined();
    });

    it('returns VIEWED if parties respond not required', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
        respondCollection: [],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBe(LinkStatus.VIEWED);
    });

    it('returns VIEWED if parties respond required but user has not responded', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondCollection: [
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: 'other-user',
            },
          },
        ],
      } as SendNotificationType;
      expect(getNotificationStatusAfterViewed(item, user)).toBe(LinkStatus.NOT_STARTED_YET);
    });
  });

  describe('getNotificationContent', () => {
    const req = mockRequestWithTranslation(
      {},
      {
        ...notificationDetailsJson,
        ...commonJsonRaw,
      }
    );
    const baseItem: SendNotificationType = {
      date: '2 October 2025',
      number: '1',
      notificationState: 'notViewedYet',
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
});
