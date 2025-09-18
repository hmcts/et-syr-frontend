import { AppRequest } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, PartiesNotify, TranslationKeys } from '../definitions/constants';
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
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  const notificationList: NotificationList[] = [];

  const notifications: SendNotificationTypeItem[] = getSendNotification(sendNotificationCollection);
  notifications?.forEach(item => notificationList.push(buildSendNotification(item, translations, languageParam)));

  return notificationList;
};

const getSendNotification = (sendNotificationCollection: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return sendNotificationCollection?.filter(it => it.value.sendNotificationNotify !== PartiesNotify.CLAIMANT_ONLY);
};

const buildSendNotification = (
  item: SendNotificationTypeItem,
  translations: AnyRecord,
  languageParam: string
): NotificationList => {
  // TODO: update status based on actual status when available
  const appState = LinkStatus.IN_PROGRESS;
  return {
    date: item.value.date,
    redirectUrl: PageUrls.NOTIFICATION_DETAILS.replace(':itemId', item.id) + languageParam,
    linkText: item.value.sendNotificationTitle,
    displayStatus: translations[item.value.notificationState],
    statusColor: linkStatusColorMap.get(appState),
  };
};
