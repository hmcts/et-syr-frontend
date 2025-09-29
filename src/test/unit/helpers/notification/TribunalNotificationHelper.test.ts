import { AppRequest, UserDetails } from '../../../../main/definitions/appRequest';
import { PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import { getTribunalNotificationBanner } from '../../../../main/helpers/notification/TribunalNotificationHelper';

describe('TribunalNotificationHelper', () => {
  describe('getTribunalNotification', () => {
    const mockUser = { id: 'user-1' } as UserDetails;

    it('should return empty notification if sendNotificationCollection is empty', () => {
      const req = {
        session: { userCase: { sendNotificationCollection: [] }, user: mockUser },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(0);
      expect(result).toEqual({ anyResponseRequired: false, notification: [] });
    });

    it('should return notification with response required', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-1',
                value: {
                  sendNotificationTitle: 'Test Notification',
                  sendNotificationSelectParties: PartiesRespond.RESPONDENT,
                  sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
                  respondentState: [],
                },
              },
            ],
          },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(1);
      expect(result.notificationList[0].isResponseRequired).toBe(true);
      expect(result.notificationList[0].redirectUrl).toBe('/respond-to-notification/notif-1?lng=en');
      expect(result.anyResponseRequired).toBe(true);
    });

    it('should return notification with no response required for other parties', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-1',
                value: {
                  sendNotificationTitle: 'Test Notification',
                  sendNotificationSelectParties: PartiesRespond.CLAIMANT,
                  sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
                  respondentState: [],
                },
              },
            ],
          },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(1);
      expect(result.notificationList[0].isResponseRequired).toBe(false);
      expect(result.notificationList[0].redirectUrl).toBe('/notification-details/notif-1?lng=en');
      expect(result.anyResponseRequired).toBe(false);
    });

    it('should skip notifications already responded by user', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-1',
                value: {
                  sendNotificationTitle: 'Test Notification',
                  sendNotificationSelectParties: PartiesRespond.RESPONDENT,
                  sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
                  respondentState: [
                    {
                      value: {
                        userIdamId: 'user-1',
                      },
                    },
                  ],
                },
              },
            ],
          },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(0);
      expect(result.anyResponseRequired).toBe(false);
    });
  });
});
