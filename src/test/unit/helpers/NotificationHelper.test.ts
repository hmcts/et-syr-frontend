import { AppRequest } from '../../../main/definitions/appRequest';
import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify } from '../../../main/definitions/constants';
import { LinkStatus } from '../../../main/definitions/links';
import { getNotificationCollection } from '../../../main/helpers/NotificationHelper';
import caseDetailsStatusJson from '../../../main/resources/locales/en/translation/case-details-status.json';

const mockTranslation = {
  ...caseDetailsStatusJson,
};

describe('getNotificationCollection', () => {
  const mockReq = (sendNotificationCollection: SendNotificationTypeItem[]): AppRequest =>
    ({
      session: {
        userCase: { sendNotificationCollection },
      },
      t: jest.fn().mockImplementation(() => mockTranslation),
      url: '/en',
    } as unknown as AppRequest);

  it('should return an empty array if no notifications', () => {
    const req = mockReq([]);
    const result = getNotificationCollection(req);
    expect(result).toEqual([]);
  });

  it('should filter out CLAIMANT_ONLY notifications', () => {
    const notifications: SendNotificationTypeItem[] = [
      {
        id: '1',
        value: {
          sendNotificationNotify: PartiesNotify.CLAIMANT_ONLY,
          sendNotificationTitle: 'Title 1',
          notificationState: LinkStatus.NOT_STARTED_YET,
          date: '2025-09-18',
        },
      },
      {
        id: '2',
        value: {
          sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          sendNotificationTitle: 'Title 2',
          notificationState: LinkStatus.NOT_STARTED_YET,
          date: '2025-09-17',
        },
      },
    ];
    const req = mockReq(notifications);
    const result = getNotificationCollection(req);
    expect(result).toHaveLength(1);
    expect(result[0].linkText).toBe('Title 2');
    expect(result[0].displayStatus).toBe('Not started yet');
  });

  it('should map notification fields correctly', () => {
    const notifications: SendNotificationTypeItem[] = [
      {
        id: '3',
        value: {
          sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          sendNotificationTitle: 'Test Title',
          notificationState: LinkStatus.NOT_STARTED_YET,
          date: '2025-09-16',
        },
      },
    ];
    const req = mockReq(notifications);
    const result = getNotificationCollection(req);
    expect(result[0]).toMatchObject({
      date: '2025-09-16',
      linkText: 'Test Title',
      displayStatus: 'Not started yet',
    });
  });
});
