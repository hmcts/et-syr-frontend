import { AppRequest, UserDetails } from '../definitions/appRequest';
import { SendNotificationType, SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, PartiesNotify, PartiesRespond, TranslationKeys } from '../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../definitions/links';
import { NotificationList } from '../definitions/notificationList';
import { AnyRecord } from '../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

/**
 * Get user's notification
 * @param req request
 */
export const getNotificationCollection = (req: AppRequest): NotificationList[] => {
  const { userCase } = req.session;
  const { sendNotificationCollection } = userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: NotificationList[] = [];

  const notifications: SendNotificationTypeItem[] = getSendNotification(sendNotificationCollection);
  notifications?.forEach(item =>
    notificationList.push(buildSendNotification(item, translations, languageParam, req.session.user))
  );

  return notificationList;
};

const getSendNotification = (sendNotificationCollection: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return sendNotificationCollection?.filter(it => it.value.sendNotificationNotify !== PartiesNotify.CLAIMANT_ONLY);
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
  if (notification.sendNotificationSelectParties !== PartiesRespond.CLAIMANT) {
    return LinkStatus.NOT_STARTED_YET;
  }
  return LinkStatus.NOT_VIEWED;
};
