import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../definitions/constants';
import { TseStoreNotification } from '../../definitions/notification/tseStoreNotification';
import { getNotificationStoredSubmitUrl } from '../NotificationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { getYourStoredApplicationList } from '../StoredApplicationHelper';

/**
 * Get notification banner for stored applications
 * @param req request
 */
export const getStoredBannerList = (req: AppRequest): TseStoreNotification[] => {
  const { userCase, user } = req.session;
  const languageParam = getLanguageParam(req.url);

  const notifications: TseStoreNotification[] = [];
  notifications.push(...getStoredApplication(req, languageParam));
  notifications.push(...getStoredNotificationRespond(userCase.sendNotificationCollection, user, languageParam));

  return notifications;
};

const getStoredApplication = (req: AppRequest, languageParam: string): TseStoreNotification[] => {
  const apps: GenericTseApplicationTypeItem[] = getYourStoredApplicationList(req);
  const notifications: TseStoreNotification[] = [];
  for (const app of apps || []) {
    notifications.push({
      viewUrl: PageUrls.STORED_CORRESPONDENCE_SUBMIT.replace(':appId', app.id) + languageParam,
    });
  }
  return notifications;
};

const getStoredNotificationRespond = (
  items: SendNotificationTypeItem[],
  user: UserDetails,
  languageParam: string
): TseStoreNotification[] => {
  const storeNotifications: TseStoreNotification[] = [];

  const itemsFiltered = items?.filter(item =>
    item.value?.respondentRespondStoredCollection?.some(response => response.value.fromIdamId === user.id)
  );

  for (const item of itemsFiltered || []) {
    if (item.value.respondentRespondStoredCollection) {
      item.value.respondentRespondStoredCollection
        .filter(response => response.value?.fromIdamId === user.id)
        .forEach(r =>
          storeNotifications.push({
            viewUrl: getNotificationStoredSubmitUrl(item, r) + languageParam,
          })
        );
    }
  }

  return storeNotifications;
};
