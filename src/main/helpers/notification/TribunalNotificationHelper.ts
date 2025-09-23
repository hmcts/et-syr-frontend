import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, PartiesRespond } from '../../definitions/constants';
import { NotificationDetails, PseNotification } from '../../definitions/notification/pseNotification';

export const getTribunalNotification = (req: AppRequest): PseNotification => {
  const notificationDetails: NotificationDetails[] = [];
  const { userCase, user } = req.session;

  for (const item of userCase.sendNotificationCollection || []) {
    const itemDetails = getNotificationDetails(item, user);
    if (itemDetails) {
      notificationDetails.push(itemDetails);
    }
  }

  const isNeedsRequired = notificationDetails.some(detail => detail.isResponseRequired);

  return { anyResponseRequired: isNeedsRequired, notification: notificationDetails };
};

const getNotificationDetails = (item: SendNotificationTypeItem, user: UserDetails): NotificationDetails => {
  const found = item?.value?.respondentState?.some(state => state.value.userIdamId === user.id);
  if (found) {
    return;
  }

  const isNeedsResponse =
    item.value.sendNotificationSelectParties === PartiesRespond.BOTH_PARTIES ||
    item.value.sendNotificationSelectParties === PartiesRespond.RESPONDENT;
  return {
    isResponseRequired: isNeedsResponse,
    redirectUrl: isNeedsResponse
      ? PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', item.id)
      : PageUrls.NOTIFICATION_DETAILS.replace(':itemId', item.id),
    notificationTitle: item.value.sendNotificationTitle,
  };
};
