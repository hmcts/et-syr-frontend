import { AppRequest, UserDetails } from '../../../main/definitions/appRequest';
import {
  PseResponseType,
  RespondNotificationType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify, PartiesRespond } from '../../../main/definitions/constants';
import { TypeItem } from '../../../main/definitions/util-types';
import {
  findSelectedSendNotification,
  findSelectedStoredPseResponse,
  getExistingNotificationState,
  getNotificationDetailsUrl,
  getNotificationStoredSubmitUrl,
  getTribunalNotificationLinkStatus,
  isNotificationVisible,
  isPartiesRespondRequired,
  isRespondNotificationPartyToNotify,
} from '../../../main/helpers/NotificationHelper';

describe('NotificationHelper', () => {
  describe('isPartiesRespondRequired', () => {
    it('should return true if parties is BOTH_PARTIES', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.BOTH_PARTIES,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(true);
    });

    it('should return true if parties is RESPONDENT', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(true);
    });

    it('should return true if parties is RESPONDENT_ONLY', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesNotify.RESPONDENT_ONLY,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(true);
    });

    it('should return false if parties is CLAIMANT', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(false);
    });

    it('should return false if parties is CLAIMANT_ONLY', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesNotify.CLAIMANT_ONLY,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(false);
    });
  });

  describe('isRespondNotificationPartyToNotify', () => {
    it('should return true if parties is BOTH_PARTIES', () => {
      const item: RespondNotificationType = {
        respondNotificationPartyToNotify: PartiesNotify.BOTH_PARTIES,
      };
      expect(isRespondNotificationPartyToNotify(item)).toBe(true);
    });

    it('should return true if parties is RESPONDENT', () => {
      const item: RespondNotificationType = {
        respondNotificationPartyToNotify: PartiesNotify.RESPONDENT_ONLY,
      };
      expect(isRespondNotificationPartyToNotify(item)).toBe(true);
    });

    it('should return false if parties is CLAIMANT', () => {
      const item: RespondNotificationType = {
        respondNotificationPartyToNotify: PartiesNotify.CLAIMANT_ONLY,
      };
      expect(isRespondNotificationPartyToNotify(item)).toBe(false);
    });
  });

  describe('isNotificationVisible', () => {
    it('should return true if sendNotificationNotify is BOTH_PARTIES', () => {
      const item = { sendNotificationNotify: PartiesNotify.BOTH_PARTIES } as SendNotificationType;
      expect(isNotificationVisible(item)).toBe(true);
    });

    it('should return true if sendNotificationNotify is RESPONDENT_ONLY', () => {
      const item = { sendNotificationNotify: PartiesNotify.RESPONDENT_ONLY } as SendNotificationType;
      expect(isNotificationVisible(item)).toBe(true);
    });

    it('should return true if respondNotificationTypeCollection has a shared tribunal response', () => {
      const item = {
        respondNotificationTypeCollection: [
          {
            id: '1',
            value: {
              respondNotificationPartyToNotify: PartiesNotify.BOTH_PARTIES,
            },
          },
        ],
      } as SendNotificationType;
      expect(isNotificationVisible(item)).toBe(true);
    });

    it('should return true if respondCollection has a shared other party response', () => {
      const item = {
        respondCollection: [
          {
            value: {
              copyToOtherParty: 'Yes',
            },
          },
        ],
      } as SendNotificationType;
      expect(isNotificationVisible(item)).toBe(true);
    });

    it('should return false if none of the above', () => {
      const item = {} as SendNotificationType;
      expect(isNotificationVisible(item)).toBe(false);
    });
  });

  describe('findSelectedSendNotification', () => {
    it('should return the item with matching id', () => {
      const items = [
        { id: '1', value: {} },
        { id: '2', value: {} },
      ];
      expect(findSelectedSendNotification(items, '2')).toEqual({
        id: '2',
        value: {},
      });
    });
    it('should return undefined if no item matches', () => {
      const items = [{ id: '1', value: {} }];
      expect(findSelectedSendNotification(items, '3')).toBeUndefined();
    });
    it('should return undefined if items is undefined', () => {
      expect(findSelectedSendNotification(undefined, '1')).toBeUndefined();
    });
  });

  describe('findSelectedStoredPseResponse', () => {
    const user = { id: 'user-1' } as UserDetails;

    it('returns the response with matching id and user id', () => {
      const item = {
        respondentRespondStoredCollection: [
          { id: 'resp-1', value: { fromIdamId: 'user-1', response: 'abc' } },
          { id: 'resp-2', value: { fromIdamId: 'user-2', response: 'def' } },
        ],
      } as SendNotificationType;
      const result = findSelectedStoredPseResponse(item, 'resp-1', user);
      expect(result).toEqual({ id: 'resp-1', value: { fromIdamId: 'user-1', response: 'abc' } });
    });

    it('returns undefined if id matches but user id does not', () => {
      const item = {
        respondentRespondStoredCollection: [{ id: 'resp-1', value: { fromIdamId: 'user-2', response: 'abc' } }],
      } as SendNotificationType;
      const result = findSelectedStoredPseResponse(item, 'resp-1', user);
      expect(result).toBeUndefined();
    });

    it('returns undefined if id does not match', () => {
      const item = {
        respondentRespondStoredCollection: [{ id: 'resp-2', value: { fromIdamId: 'user-1', response: 'abc' } }],
      } as SendNotificationType;
      const result = findSelectedStoredPseResponse(item, 'resp-1', user);
      expect(result).toBeUndefined();
    });

    it('returns undefined if respondentRespondStoredCollection is empty', () => {
      const item = {
        respondentRespondStoredCollection: [],
      } as SendNotificationType;
      const result = findSelectedStoredPseResponse(item, 'resp-1', user);
      expect(result).toBeUndefined();
    });

    it('returns undefined if respondentRespondStoredCollection is undefined', () => {
      const item = {} as SendNotificationType;
      const result = findSelectedStoredPseResponse(item, 'resp-1', user);
      expect(result).toBeUndefined();
    });

    it('returns undefined if item is undefined', () => {
      const result = findSelectedStoredPseResponse(undefined, 'resp-1', user);
      expect(result).toBeUndefined();
    });
  });

  describe('getExistingNotificationState', () => {
    const user: UserDetails = { id: 'user-1' } as UserDetails;
    it('should return the notificationState if user has respondentState with notificationState', () => {
      const notification = {
        respondentState: [
          { value: { userIdamId: 'user-1', notificationState: 'readyToView' } },
          { value: { userIdamId: 'user-2', notificationState: 'notViewedYet' } },
        ],
      } as SendNotificationType;
      expect(getExistingNotificationState(notification, user)).toBe('readyToView');
    });

    it('should return NOT_VIEWED if user has respondentState without notificationState', () => {
      const notification = {
        respondentState: [{ value: { userIdamId: 'user-1' } }],
      } as SendNotificationType;
      expect(getExistingNotificationState(notification, user)).toBe('notViewedYet');
    });

    it('should return NOT_VIEWED if user does not have respondentState', () => {
      const notification = {
        respondentState: [{ value: { userIdamId: 'user-2', notificationState: 'readyToView' } }],
      } as SendNotificationType;
      expect(getExistingNotificationState(notification, user)).toBe('notViewedYet');
    });

    it('should return NOT_VIEWED if notification is undefined', () => {
      expect(getExistingNotificationState(undefined, user)).toBe('notViewedYet');
    });

    it('should return NOT_VIEWED if respondentState is undefined', () => {
      const notification = {} as SendNotificationType;
      expect(getExistingNotificationState(notification, user)).toBe('notViewedYet');
    });
  });

  describe('getTribunalNotificationLinkStatus', () => {
    const mockUser = { id: 'user-1' } as UserDetails;
    const baseNotification: SendNotificationTypeItem = {
      id: 'notif-1',
      value: {
        sendNotificationTitle: 'Test',
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
      },
    };

    it('returns NOT_YET_AVAILABLE if sendNotificationCollection is undefined', () => {
      const req = { session: { userCase: {}, user: mockUser } } as AppRequest;
      expect(getTribunalNotificationLinkStatus(req)).toBe('notAvailableYet');
    });

    it('returns NOT_YET_AVAILABLE if sendNotificationCollection is empty', () => {
      const req = {
        session: { userCase: { sendNotificationCollection: [] }, user: mockUser },
      } as AppRequest;
      expect(getTribunalNotificationLinkStatus(req)).toBe('notAvailableYet');
    });

    it('returns NOT_YET_AVAILABLE if all notifications are not visible', () => {
      const notif = { ...baseNotification, value: { ...baseNotification.value, sendNotificationNotify: 'TEST' } };
      const req = {
        session: { userCase: { sendNotificationCollection: [notif] }, user: mockUser },
      } as AppRequest;
      expect(getTribunalNotificationLinkStatus(req)).toBe('notAvailableYet');
    });

    it('returns READY_TO_VIEW if visible notifications', () => {
      const req = {
        session: { userCase: { sendNotificationCollection: [baseNotification] }, user: mockUser },
      } as AppRequest;
      expect(getTribunalNotificationLinkStatus(req)).toBe('readyToView');
    });
  });

  describe('getNotificationDetailsUrl', () => {
    it('should return the correct URL with item id', () => {
      const item = { id: 'notif-123', value: {} } as SendNotificationTypeItem;
      const url = getNotificationDetailsUrl(item);
      expect(url).toBe('/notification-details/notif-123');
    });
  });

  describe('getNotificationStoredSubmitUrl', () => {
    it('should return the correct URL with item id', () => {
      const item: SendNotificationTypeItem = { id: 'notif-123', value: {} };
      const response: TypeItem<PseResponseType> = { id: 'resp-456', value: {} };
      const url = getNotificationStoredSubmitUrl(item, response);
      expect(url).toBe('/respond-to-notification-stored-submit/notif-123/resp-456');
    });
  });
});
