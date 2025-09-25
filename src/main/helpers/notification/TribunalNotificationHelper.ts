import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../definitions/constants';
import { LinkStatus } from '../../definitions/links';
import { NotificationDetails, PseNotification } from '../../definitions/notification/pseNotification';
import { isNotificationVisible, isResponseRequiredFromRespondent } from '../NotificationHelper';

const priorityOrder = [
  LinkStatus.NOT_STARTED_YET,
  LinkStatus.NOT_VIEWED,
  LinkStatus.UPDATED,
  LinkStatus.IN_PROGRESS,
  LinkStatus.VIEWED,
  LinkStatus.WAITING_FOR_TRIBUNAL,
  LinkStatus.READY_TO_VIEW,
];

/**
 * Get tribunal notifications for the current user.
 * @param req AppRequest
 */
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

  const isNeedsResponse = isResponseRequiredFromRespondent(item.value.sendNotificationSelectParties);
  return {
    isResponseRequired: isNeedsResponse,
    redirectUrl: isNeedsResponse
      ? PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', item.id)
      : PageUrls.NOTIFICATION_DETAILS.replace(':itemId', item.id),
    notificationTitle: item.value.sendNotificationTitle,
  };
};

/**
 * Get the link status for the tribunal notification link on the case details page.
 * @param req AppRequest
 */
export const getTribunalNotificationLinkStatus = (req: AppRequest): LinkStatus => {
  const { userCase, user } = req.session;
  const { sendNotificationCollection } = userCase;
  const notification = sendNotificationCollection?.filter(n => isNotificationVisible(n.value)) || [];
  return getLinkStatus(notification, user);
};

const getLinkStatus = (items: SendNotificationTypeItem[], user: UserDetails): LinkStatus => {
  if (!items?.length) {
    return LinkStatus.NOT_YET_AVAILABLE;
  }

  const userApplicationStates = getUserNotificationStates(items, user);
  for (const status of priorityOrder) {
    if (userApplicationStates.includes(status)) {
      return status;
    }
  }

  return LinkStatus.READY_TO_VIEW;
};

const getUserNotificationStates = (apps: SendNotificationTypeItem[], user: UserDetails): string[] => {
  return (
    apps?.flatMap(
      app =>
        app.value?.respondentState
          ?.filter(state => state.value?.userIdamId === user?.id)
          .map(state => state.value?.notificationState) || []
    ) || []
  );
};
