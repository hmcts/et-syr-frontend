import { UserDetails } from '../../../main/definitions/appRequest';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify, PartiesRespond } from '../../../main/definitions/constants';
import { LinkStatus } from '../../../main/definitions/links';
import {
  getNotificationState,
  getVisibleSendNotifications,
  isNotificationVisible,
} from '../../../main/helpers/NotificationHelper';

describe('NotificationHelper', () => {
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

  describe('getVisibleSendNotifications', () => {
    it('should filter only visible notifications', () => {
      const notifications: SendNotificationTypeItem[] = [
        {
          value: {
            sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          },
        },
        {
          value: {
            sendNotificationNotify: PartiesNotify.CLAIMANT_ONLY,
          },
        },
        {
          value: {
            respondCollection: [
              {
                id: '1',
                value: { copyToOtherParty: 'Yes' },
              },
            ],
          },
        },
      ];
      const result = getVisibleSendNotifications(notifications);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if input is undefined', () => {
      expect(getVisibleSendNotifications(undefined)).toEqual([]);
    });
  });

  describe('getNotificationState', () => {
    const user: UserDetails = { id: 'user-1' } as UserDetails;

    it('should return the notificationState if it exists', () => {
      const notification: SendNotificationType = {
        respondentState: [
          {
            value: {
              userIdamId: 'user-1',
              notificationState: LinkStatus.COMPLETED,
            },
          },
        ],
      } as SendNotificationType;
      expect(getNotificationState(notification, user)).toBe(LinkStatus.COMPLETED);
    });

    it('should return NOT_STARTED_YET if notificationState does not exist and sendNotificationSelectParties is not CLAIMANT', () => {
      const notification: SendNotificationType = {
        respondentState: [
          {
            value: {
              userIdamId: 'user-1',
            },
          },
        ],
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
      } as SendNotificationType;
      expect(getNotificationState(notification, user)).toBe(LinkStatus.NOT_STARTED_YET);
    });

    it('should return NOT_VIEWED if notificationState does not exist and sendNotificationSelectParties is CLAIMANT', () => {
      const notification: SendNotificationType = {
        respondentState: [
          {
            value: {
              userIdamId: 'user-1',
            },
          },
        ],
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
      } as SendNotificationType;
      expect(getNotificationState(notification, user)).toBe(LinkStatus.READY_TO_VIEW);
    });

    it('should return NOT_VIEWED if respondentState is undefined and sendNotificationSelectParties is CLAIMANT', () => {
      const notification: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.CLAIMANT,
      } as SendNotificationType;
      expect(getNotificationState(notification, user)).toBe(LinkStatus.READY_TO_VIEW);
    });

    it('should return NOT_STARTED_YET if respondentState is undefined and sendNotificationSelectParties is not CLAIMANT', () => {
      const notification: SendNotificationType = {
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
      } as SendNotificationType;
      expect(getNotificationState(notification, user)).toBe(LinkStatus.NOT_STARTED_YET);
    });
  });
});
