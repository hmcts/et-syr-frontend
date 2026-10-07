import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify } from '../../../main/definitions/constants';
import { HearingDetails } from '../../../main/definitions/hearingDetails';
import { LinkStatus } from '../../../main/definitions/links';
import { AnyRecord } from '../../../main/definitions/util-types';
import { getHearingCollection } from '../../../main/helpers/HearingHelper';
import hearingDetailsTranslation from '../../../main/resources/locales/en/translation/hearing-details.json';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';

describe('Hearing Helpers', () => {
  describe('getHearingCollection', () => {
    const translations: AnyRecord = { ...hearingDetailsTranslation };
    const request = mockRequestWithTranslation({}, translations);
    request.session.user.id = 'user-1';

    it('should render the hearing details page', () => {
      const sendNotificationCollection: SendNotificationTypeItem[] = [
        {
          id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
          value: {
            date: '11 April 2025',
            sendNotificationTitle: 'Hearing-1',
            sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
            sendNotificationSubject: ['Hearing'],
            sendNotificationSelectHearing: {
              selectedCode: '123abc',
            },
            respondentState: [
              {
                id: '7f3a9c21-5e84-4b17-a6d2-91c8f04e7b53',
                value: {
                  userIdamId: 'user-1',
                  notificationState: LinkStatus.VIEWED,
                },
              },
            ],
          },
        },
      ];
      request.session.userCase.hearingCollection = mockHearingCollection;
      request.session.userCase.sendNotificationCollection = sendNotificationCollection;
      const actual = getHearingCollection(request);
      const expected: HearingDetails[] = [
        {
          hearingNumber: '3333',
          hearingType: 'Hearing',
          hearingDateRows: [
            {
              date: new Date('2028-07-04T14:00:00.000'),
              status: 'Listed',
              venue: 'Field House',
            },
          ],
          notifications: [
            {
              date: '11 April 2025',
              displayStatus: 'Viewed',
              notificationTitle: 'Hearing-1',
              redirectUrl: '/notification-details/daeade9a-52df-48f6-9ef8-4eb210dac9e3?lng=en',
              statusColor: '--teal',
            },
          ],
        },
      ];
      expect(actual).toEqual(expected);
    });

    it('should render the hearing details page without matching respondentState', () => {
      const sendNotificationCollection: SendNotificationTypeItem[] = [
        {
          id: 'daeade9a-52df-48f6-9ef8-4eb210dac9e3',
          value: {
            date: '11 April 2025',
            sendNotificationTitle: 'Hearing-1',
            sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
            sendNotificationSubject: ['Hearing'],
            sendNotificationSelectHearing: {
              selectedCode: '123abc',
            },
            respondentState: [
              {
                id: '7f3a9c21-5e84-4b17-a6d2-91c8f04e7b53',
                value: {
                  userIdamId: 'user-2',
                  notificationState: LinkStatus.VIEWED,
                },
              },
            ],
          },
        },
      ];
      request.session.userCase.hearingCollection = mockHearingCollection;
      request.session.userCase.sendNotificationCollection = sendNotificationCollection;
      const actual = getHearingCollection(request);
      const expected: HearingDetails[] = [
        {
          hearingNumber: '3333',
          hearingType: 'Hearing',
          hearingDateRows: [
            {
              date: new Date('2028-07-04T14:00:00.000'),
              status: 'Listed',
              venue: 'Field House',
            },
          ],
          notifications: [
            {
              date: '11 April 2025',
              displayStatus: 'Not viewed yet',
              notificationTitle: 'Hearing-1',
              redirectUrl: '/notification-details/daeade9a-52df-48f6-9ef8-4eb210dac9e3?lng=en',
              statusColor: '--red',
            },
          ],
        },
      ];
      expect(actual).toEqual(expected);
    });

    it('should render the hearing details page without notification', () => {
      request.session.userCase.hearingCollection = mockHearingCollection;
      request.session.userCase.sendNotificationCollection = undefined;
      const actual = getHearingCollection(request);
      const expected: HearingDetails[] = [
        {
          hearingNumber: '3333',
          hearingType: 'Hearing',
          hearingDateRows: [
            {
              date: new Date('2028-07-04T14:00:00.000'),
              status: 'Listed',
              venue: 'Field House',
            },
          ],
          notifications: [],
        },
      ];
      expect(actual).toEqual(expected);
    });

    it('should render the hearing details page without hearing', () => {
      request.session.userCase.hearingCollection = undefined;
      request.session.userCase.sendNotificationCollection = undefined;
      const actual = getHearingCollection(request);
      const expected: HearingDetails[] = [];
      expect(actual).toEqual(expected);
    });
  });
});
