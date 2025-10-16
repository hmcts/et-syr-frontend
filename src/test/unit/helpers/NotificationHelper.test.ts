import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify } from '../../../main/definitions/constants';
import { isNotificationVisible } from '../../../main/helpers/NotificationHelper';

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
});
