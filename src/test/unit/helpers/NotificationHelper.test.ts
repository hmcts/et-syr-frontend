import { UserDetails } from '../../../main/definitions/appRequest';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, PartiesNotify, PartiesRespond } from '../../../main/definitions/constants';
import { LinkStatus } from '../../../main/definitions/links';
import {
  findSelectedSendNotification,
  getNotificationState,
  getVisibleSendNotifications,
  hasUserResponded,
  hasUserViewed,
  isNotificationVisible,
  isPartiesRespondRequired,
} from '../../../main/helpers/NotificationHelper';

describe('NotificationHelper', () => {
  describe('isPartiesRespondRequired', () => {
    it('should return true if parties is BOTH_PARTIES', () => {
      expect(isPartiesRespondRequired(PartiesRespond.BOTH_PARTIES)).toBe(true);
    });
    it('should return true if parties is RESPONDENT', () => {
      expect(isPartiesRespondRequired(PartiesRespond.RESPONDENT)).toBe(true);
    });
    it('should return false if parties is CLAIMANT', () => {
      expect(isPartiesRespondRequired(PartiesRespond.CLAIMANT)).toBe(false);
    });
  });

  describe('hasUserResponded', () => {
    const user: UserDetails = { id: 'user-1' } as UserDetails;
    it('should return true if user has responded as RESPONDENT', () => {
      const respondCollection = [
        { id: '1', value: { from: Applicant.RESPONDENT, fromIdamId: 'user-1' } },
        { id: '2', value: { from: Applicant.CLAIMANT, fromIdamId: 'user-2' } },
      ];
      expect(hasUserResponded(respondCollection, user)).toBe(true);
    });
    it('should return false if user has not responded', () => {
      const respondCollection = [{ id: '2', value: { from: Applicant.CLAIMANT, fromIdamId: 'user-2' } }];
      expect(hasUserResponded(respondCollection, user)).toBe(false);
    });
    it('should return false if respondCollection is undefined', () => {
      expect(hasUserResponded(undefined, user)).toBe(false);
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
