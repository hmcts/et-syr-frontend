import { AppRequest, UserDetails } from '../../../../main/definitions/appRequest';
import { PageUrls } from '../../../../main/definitions/constants';
import { getStoredBannerList } from '../../../../main/helpers/notification/StoredNotificationHelper';

describe('StoredNotificationHelper', () => {
  const mockUser = { id: 'user-1' } as UserDetails;

  it('returns empty array if no stored applications or notifications', () => {
    const req = {
      session: { userCase: { sendNotificationCollection: [] }, user: mockUser },
      url: '/some-url?lng=en',
    } as AppRequest;
    const result = getStoredBannerList(req);
    expect(result).toHaveLength(0);
  });

  it('returns stored application notifications', () => {
    const req = {
      session: {
        userCase: {
          sendNotificationCollection: [
            {
              id: 'notif-1',
              value: {
                respondentRespondStoredCollection: [{ id: 'row-1', value: { fromIdamId: 'user-1' } }],
              },
            },
          ],
        },
        user: mockUser,
      },
      url: '/some-url?lng=en',
    } as AppRequest;
    const result = getStoredBannerList(req);
    expect(result).toEqual([{ viewUrl: '/respond-to-notification-stored-submit/notif-1/row-1?lng=en' }]);
  });

  it('returns responses for matching respondCollection items and checks values inside rows', () => {
    const req = {
      session: {
        userCase: {
          sendNotificationCollection: [
            {
              id: 'notif-1',
              value: {
                respondentRespondStoredCollection: [
                  { id: 'row-1', value: { fromIdamId: 'user-1' } },
                  { id: 'row-2', value: { fromIdamId: 'user-2' } },
                ],
              },
            },
            {
              id: 'notif-2',
              value: {
                respondentRespondStoredCollection: [{ id: 'row-3', value: { fromIdamId: 'user-1' } }],
              },
            },
          ],
        },
        user: mockUser,
      },
      url: '/some-url?lng=en',
    } as AppRequest;
    const result = getStoredBannerList(req);
    expect(result).toHaveLength(2);
    expect(result[0].viewUrl).toBe(
      PageUrls.RESPOND_TO_NOTIFICATION_STORED_SUBMIT.replace(':itemId', 'notif-1').replace(':responseId', 'row-1') +
        '?lng=en'
    );
    expect(result[1].viewUrl).toBe(
      PageUrls.RESPOND_TO_NOTIFICATION_STORED_SUBMIT.replace(':itemId', 'notif-2').replace(':responseId', 'row-3') +
        '?lng=en'
    );
    jest.restoreAllMocks();
  });

  it('does not return responses for non-matching user id', () => {
    const req = {
      session: {
        userCase: {
          sendNotificationCollection: [
            {
              id: 'notif-1',
              value: {
                respondentRespondStoredCollection: [{ id: 'row-1', value: { fromIdamId: 'user-2' } }],
              },
            },
          ],
        },
        user: mockUser,
      },
      url: '/some-url?lng=en',
    } as AppRequest;
    const result = getStoredBannerList(req);
    expect(result).toHaveLength(0);
  });

  it('handles undefined sendNotificationCollection gracefully', () => {
    const req = {
      session: {
        userCase: {},
        user: mockUser,
      },
      url: '/some-url?lng=en',
    } as AppRequest;
    const result = getStoredBannerList(req);
    expect(result).toHaveLength(0);
  });
});
