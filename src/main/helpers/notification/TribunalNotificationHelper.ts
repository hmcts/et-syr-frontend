import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../definitions/constants';
import { NotificationDetails, PseNotification } from '../../definitions/notification/pseNotification';
import {
  getNotificationDetailsUrl,
  hasUserViewed,
  isNotificationVisible,
  isPartiesRespondRequired,
} from '../NotificationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get tribunal notifications banner for the current user.
 * @param req AppRequest
 */
export const getTribunalNotificationBanner = (req: AppRequest): PseNotification => {
  const notificationDetails: NotificationDetails[] = [];
  const { userCase, user } = req.session;

  const filteredList =
    userCase.sendNotificationCollection?.filter(n => isNotificationVisible(n.value) && !hasUserViewed(n.value, user)) ||
    [];

  filteredList.forEach(item => {
    const itemDetails = getNotificationDetails(item, getLanguageParam(req.url));
    notificationDetails.push(itemDetails);
  });

  const isNeedsRequired = notificationDetails.some(detail => detail.isResponseRequired);

  return { anyResponseRequired: isNeedsRequired, notificationList: notificationDetails };
};

const getNotificationDetails = (item: SendNotificationTypeItem, languageParam: string): NotificationDetails => {
  const isNeedsResponse = isPartiesRespondRequired(item.value);
  return {
    isResponseRequired: isNeedsResponse,
    redirectUrl: isNeedsResponse
      ? PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', item.id) + languageParam
      : getNotificationDetailsUrl(item) + languageParam,
    notificationTitle: item.value.sendNotificationTitle,
  };
};
