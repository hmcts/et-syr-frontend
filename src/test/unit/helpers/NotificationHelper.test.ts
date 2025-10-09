import { UserDetails } from '../../../main/definitions/appRequest';
import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify, PartiesRespond } from '../../../main/definitions/constants';
import {
  findSelectedSendNotification,
  hasUserViewed,
  isNotificationVisible,
  isPartiesRespondRequired,
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

    it('should return false if parties is CLAIMANT', () => {
      const item: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
      } as SendNotificationType;
      expect(isPartiesRespondRequired(item)).toBe(false);
    });
  });

  describe('hasUserViewed', () => {
    const user: UserDetails = { id: 'user-1' } as UserDetails;
    it('should return true if user has viewed', () => {
      const notification = {
        respondentState: [{ value: { userIdamId: 'user-1' } }, { value: { userIdamId: 'user-2' } }],
      } as unknown as SendNotificationType;
      expect(hasUserViewed(notification, user)).toBe(true);
    });
    it('should return false if user has not viewed', () => {
      const notification = {
        respondentState: [{ value: { userIdamId: 'user-2' } }],
      } as unknown as SendNotificationType;
      expect(hasUserViewed(notification, user)).toBe(false);
    });
    it('should return false if notification is undefined', () => {
      expect(hasUserViewed(undefined, user)).toBe(false);
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
});
