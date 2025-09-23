import { AppRequest, UserDetails } from '../../../../main/definitions/appRequest';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, PartiesRespond } from '../../../../main/definitions/constants';
import { getTribunalNotification } from '../../../../main/helpers/notification/TribunalNotificationHelper';

describe('TribunalNotificationHelper', () => {
  describe('getTribunalNotification', () => {
    const mockUser = { id: 'user-1' } as UserDetails;

    const baseNotification: SendNotificationTypeItem = {
      id: 'notif-1',
      value: {
        sendNotificationTitle: 'Test Notification',
        sendNotificationSelectParties: PartiesRespond.RESPONDENT,
        respondentState: [],
      },
    };

    it('should return empty notification if sendNotificationCollection is empty', () => {
      const req = {
        session: { userCase: { sendNotificationCollection: [] }, user: mockUser },
      } as AppRequest;
      const result = getTribunalNotification(req);
      expect(result).toEqual({ anyResponseRequired: false, notification: [] });
    });

    it('should return notification with response required', () => {
      const req = {
        session: {
          userCase: { sendNotificationCollection: [baseNotification] },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotification(req);
      expect(result.notification[0].isResponseRequired).toBe(true);
      expect(result.notification[0].redirectUrl).toBe(PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', 'notif-1'));
      expect(result.anyResponseRequired).toBe(true);
    });

    it('should return notification with no response required for other parties', () => {
      const notification = {
        ...baseNotification,
        value: {
          ...baseNotification.value,
          sendNotificationSelectParties: PartiesRespond.CLAIMANT,
        },
      };
      const req = {
        session: {
          userCase: { sendNotificationCollection: [notification] },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotification(req);
      expect(result.notification[0].isResponseRequired).toBe(false);
      expect(result.notification[0].redirectUrl).toBe(PageUrls.NOTIFICATION_DETAILS.replace(':itemId', 'notif-1'));
      expect(result.anyResponseRequired).toBe(false);
    });

    it('should skip notifications already responded by user', () => {
      const notification = {
        ...baseNotification,
        value: {
          ...baseNotification.value,
          respondentState: [{ value: { userIdamId: 'user-1' } }],
        },
      };
      const req = {
        session: {
          userCase: { sendNotificationCollection: [notification] },
          user: mockUser,
        },
      } as AppRequest;
      const result = getTribunalNotification(req);
      expect(result.notification).toHaveLength(0);
      expect(result.anyResponseRequired).toBe(false);
    });
  });
});
