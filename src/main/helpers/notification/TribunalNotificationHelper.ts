import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../definitions/constants';
import { NotificationDetails, PseNotification } from '../../definitions/notification/pseNotification';
import { isResponseRequired } from '../NotificationHelper';

export const getTribunalNotification = (req: AppRequest): PseNotification => {
  const notificationDetails: NotificationDetails[] = [];
  const { userCase } = req.session;

  for (const item of userCase.sendNotificationCollection || []) {
    const itemDetails = getNotificationDetails(item);
    if (itemDetails) {
      notificationDetails.push(itemDetails);
    }
  }

  const isNeedsRequired = notificationDetails.some(detail => detail.isResponseRequired);

  return { anyResponseRequired: isNeedsRequired, notification: notificationDetails };
};

const getNotificationDetails = (item: SendNotificationTypeItem): NotificationDetails => {
  // TODO
  if (!isNotificationShown(item)) {
    return;
  }
  // TODO
  return getRequestItems(item);
};

const isNotificationShown = (item: SendNotificationTypeItem): boolean => {
  // TODO
  return item.value !== undefined;
};

const getRequestItems = (item: SendNotificationTypeItem): NotificationDetails => {
  const isNeedsResponse = isResponseRequired(item.value);
  return {
    isResponseRequired: isNeedsResponse,
    redirectUrl: getRedirectUrlForNotification(item.id, isNeedsResponse),
    notificationTitle: item.value.sendNotificationTitle,
  };
};

const getRedirectUrlForNotification = (itemId: string, needsResponse: boolean): string => {
  return needsResponse
    ? PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', itemId)
    : PageUrls.NOTIFICATION_DETAILS.replace(':itemId', itemId);
};
