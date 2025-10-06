import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { NotificationList } from '../../definitions/notificationList';
import { AnyRecord } from '../../definitions/util-types';
import { isNotificationVisible } from '../NotificationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get user's notification list in All Notifications page
 * @param req request
 */
export const getNotificationCollection = (req: AppRequest): NotificationList[] => {
  const { userCase, user } = req.session;
  const { sendNotificationCollection } = userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: NotificationList[] = [];

  const notifications: SendNotificationTypeItem[] =
    sendNotificationCollection?.filter(it => isNotificationVisible(it.value)) || [];
  notifications?.forEach(item => notificationList.push(buildSendNotification(item, translations, languageParam, user)));

  return notificationList;
};

const buildSendNotification = (
  notification: SendNotificationTypeItem,
  translations: AnyRecord,
  languageParam: string,
  user: UserDetails
): NotificationList => {
  const notificationState = getNotificationState(notification.value, user);
  return {
    date: notification.value.date,
    redirectUrl: PageUrls.NOTIFICATION_DETAILS.replace(':itemId', notification.id) + languageParam,
    linkText: notification.value.sendNotificationTitle,
    displayStatus: translations[notificationState],
    statusColor: linkStatusColorMap.get(notificationState),
  };
};

const getNotificationState = (notification: SendNotificationType, user: UserDetails): LinkStatus => {
  const existingState = notification?.respondentState?.find(state => state.value.userIdamId === user.id);
  if (existingState?.value?.notificationState) {
    return existingState.value.notificationState as LinkStatus;
  }
  return LinkStatus.NOT_VIEWED;
};
