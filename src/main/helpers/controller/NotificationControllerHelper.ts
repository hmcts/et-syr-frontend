import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import { linkStatusColorMap } from '../../definitions/links';
import { NotificationList } from '../../definitions/notificationList';
import { AnyRecord } from '../../definitions/util-types';
import {
  getExistingNotificationState,
  getNotificationDetailsUrl,
  getNotificationStoredSubmitUrl,
  isNotificationVisible,
} from '../NotificationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get user's notification list in All Notifications page
 * @param req request
 */
export const getNotificationTable = (req: AppRequest): NotificationList[] => {
  const { userCase, user } = req.session;
  const { sendNotificationCollection } = userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: NotificationList[] = [];

  const notifications: SendNotificationTypeItem[] =
    sendNotificationCollection?.filter(it => isNotificationVisible(it.value)) || [];
  notifications?.forEach(item => notificationList.push(buildNotificationList(item, translations, languageParam, user)));

  return notificationList;
};

const buildNotificationList = (
  notification: SendNotificationTypeItem,
  translations: AnyRecord,
  languageParam: string,
  user: UserDetails
): NotificationList => {
  const notificationState = getExistingNotificationState(notification.value, user);
  return {
    date: notification.value.date,
    redirectUrl: getRedirectUrl(notification, user) + languageParam,
    linkText: notification.value.sendNotificationTitle,
    displayStatus: translations[notificationState],
    statusColor: linkStatusColorMap.get(notificationState),
  };
};

const getRedirectUrl = (notification: SendNotificationTypeItem, user: UserDetails): string => {
  const anyStoredResponse = notification?.value?.respondentRespondStoredCollection?.find(
    r => r.value.fromIdamId === user.id
  );
  if (anyStoredResponse) {
    return getNotificationStoredSubmitUrl(notification, anyStoredResponse);
  }
  return getNotificationDetailsUrl(notification);
};
