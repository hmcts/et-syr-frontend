import { AppRequest, UserDetails } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import {
  PseResponseType,
  RespondNotificationType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../definitions/complexTypes/sendNotificationTypeItem';
import { PartiesNotify, PartiesRespond } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';
import { TypeItem } from '../definitions/util-types';

/**
 * Check if response is required from respondent
 * compare with sendNotificationSelectParties in SendNotificationType
 * @param item sendNotificationSelectParties
 */
export const isPartiesRespondRequired = (item: SendNotificationType): boolean => {
  return (
    item.sendNotificationSelectParties === PartiesRespond.BOTH_PARTIES ||
    item.sendNotificationSelectParties === PartiesRespond.RESPONDENT
  );
};

/**
 * Check if user has already viewed the notification
 * @param notification SendNotificationType
 * @param user user details
 */
export const hasUserViewed = (notification: SendNotificationType, user: UserDetails): boolean => {
  return notification ? notification.respondentState?.some(state => state.value.userIdamId === user.id) : false;
};

/**
 * Check if sendNotification is visible to the user
 * @param item SendNotificationType
 */
export const isNotificationVisible = (item: SendNotificationType): boolean => {
  return (
    isSendNotificationNotify(item) ||
    hasTribunalResponseShared(item.respondNotificationTypeCollection) ||
    hasOtherPartyResponseShared(item.respondCollection)
  );
};

const isSendNotificationNotify = (item: SendNotificationType): boolean => {
  return (
    item.sendNotificationNotify === PartiesNotify.BOTH_PARTIES ||
    item.sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY
  );
};

const hasTribunalResponseShared = (responseList: TypeItem<RespondNotificationType>[]): boolean => {
  return (
    responseList?.some(
      r =>
        r.value.respondNotificationPartyToNotify === PartiesNotify.BOTH_PARTIES ||
        r.value.respondNotificationPartyToNotify === PartiesNotify.RESPONDENT_ONLY
    ) ?? false
  );
};

const hasOtherPartyResponseShared = (responseList: TypeItem<PseResponseType>[]): boolean => {
  return responseList?.some(r => r.value.copyToOtherParty === YesOrNo.YES) ?? false;
};

/**
 * Get existing notification state for the current user
 * @param notification
 * @param user
 */
export const getExistingNotificationState = (notification: SendNotificationType, user: UserDetails): LinkStatus => {
  const existingState = notification?.respondentState?.find(state => state.value.userIdamId === user.id);
  if (existingState?.value?.notificationState) {
    return existingState.value.notificationState as LinkStatus;
  }
  return LinkStatus.NOT_VIEWED;
};

/**
 * Get the link status for the tribunal notification link on the case details page.
 * @param req request
 */
export const getTribunalNotificationLinkStatus = (req: AppRequest): LinkStatus => {
  const { userCase } = req.session;
  const { sendNotificationCollection } = userCase;
  const notification = sendNotificationCollection?.filter(n => isNotificationVisible(n.value)) || [];
  return getLinkStatus(notification);
};

const getLinkStatus = (items: SendNotificationTypeItem[]): LinkStatus => {
  if (!items?.length) {
    return LinkStatus.NOT_YET_AVAILABLE;
  }
  return LinkStatus.READY_TO_VIEW;
};
