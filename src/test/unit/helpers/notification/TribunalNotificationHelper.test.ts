import { AppRequest, UserDetails } from '../../../../main/definitions/appRequest';
import { YesOrNo } from '../../../../main/definitions/case';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import {
  getTribunalNotificationBanner,
  getTribunalNotificationLinkStatus,
} from '../../../../main/helpers/notification/TribunalNotificationHelper';

describe('TribunalNotificationHelper', () => {
  describe('getTribunalNotification', () => {
    const mockUser = { id: 'user-1' } as UserDetails;

    it('should return empty notification if sendNotificationCollection is empty', () => {
      const req = {
        session: { userCase: { sendNotificationCollection: [] }, user: mockUser },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(0);
      expect(result).toEqual({ anyResponseRequired: false, notificationList: [] });
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

    it('should filter out notifications that are not visible', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-1',
                value: {
                  sendNotificationTitle: 'Invisible Notification',
                  sendNotificationSelectParties: PartiesRespond.RESPONDENT,
                  sendNotificationNotify: 'TEST',
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

    it('should show notification if visible via respondNotificationTypeCollection', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-2',
                value: {
                  sendNotificationTitle: 'Visible via respondNotificationTypeCollection',
                  sendNotificationSelectParties: PartiesRespond.RESPONDENT,
                  sendNotificationNotify: 'TEST',
                  respondNotificationTypeCollection: [
                    { value: { respondNotificationPartyToNotify: PartiesNotify.RESPONDENT_ONLY } },
                  ],
                },
              },
            ],
          },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(1);
      expect(result.notificationList[0].notificationTitle).toBe('Visible via respondNotificationTypeCollection');
    });

    it('should show notification if visible via respondCollection', () => {
      const req = {
        session: {
          userCase: {
            sendNotificationCollection: [
              {
                id: 'notif-3',
                value: {
                  sendNotificationTitle: 'Visible via respondCollection',
                  sendNotificationSelectParties: PartiesRespond.RESPONDENT,
                  sendNotificationNotify: 'TEST',
                  respondCollection: [{ value: { copyToOtherParty: YesOrNo.YES } }],
                },
              },
            ],
          },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(1);
      expect(result.notificationList[0].notificationTitle).toBe('Visible via respondCollection');
    });

    it('should handle undefined sendNotificationCollection gracefully', () => {
      const req = {
        session: {
          userCase: {},
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotificationBanner(req);
      expect(result.notificationList).toHaveLength(0);
      expect(result.anyResponseRequired).toBe(false);
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
});
