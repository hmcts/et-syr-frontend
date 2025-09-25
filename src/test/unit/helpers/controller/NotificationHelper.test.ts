import { PartiesNotify } from '../../../../main/definitions/constants';
import { LinkStatus } from '../../../../main/definitions/links';
import { getNotificationCollection } from '../../../../main/helpers/controller/NotificationHelper';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('getNotificationCollection', () => {
  let req: ReturnType<typeof mockRequest>;
  const mockTranslation = {
    ...caseDetailsStatusJson,
  };

  beforeEach(() => {
    req = mockRequestWithTranslation({}, mockTranslation);
    req.session.user.id = 'user123';
  });

  it('should return an empty array if no notifications', () => {
    const result = getNotificationCollection(req);
    expect(result).toEqual([]);
  });

  it('should filter out CLAIMANT_ONLY notifications', () => {
    req.session.userCase.sendNotificationCollection = [
      {
        id: '1',
        value: {
          sendNotificationNotify: PartiesNotify.CLAIMANT_ONLY,
          sendNotificationTitle: 'Title 1',
          date: '2025-09-18',
        },
      },
      {
        id: '2',
        value: {
          sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          sendNotificationTitle: 'Title 2',
          date: '2025-09-17',
        },
      },
    ];
    const result = getNotificationCollection(req);
    expect(result).toHaveLength(1);
    expect(result[0].linkText).toBe('Title 2');
    expect(result[0].displayStatus).toBe('Ready to view');
  });

  it('should map notification fields correctly', () => {
    req.session.userCase.sendNotificationCollection = [
      {
        id: '3',
        value: {
          sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          sendNotificationTitle: 'Test Title',
          respondentState: [
            {
              id: 'state1',
              value: {
                userIdamId: 'user123',
                notificationState: LinkStatus.NOT_STARTED_YET,
              },
            },
          ],
          date: '2025-09-16',
        },
      },
    ];
    const result = getNotificationCollection(req);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2025-09-16');
    expect(result[0].redirectUrl).toBe('/notification-details/3?lng=en');
    expect(result[0].linkText).toBe('Test Title');
    expect(result[0].displayStatus).toBe('Not started yet');
  });
});
