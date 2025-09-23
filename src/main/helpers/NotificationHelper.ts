import { UserDetails } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import {
  PseResponseType,
  RespondNotificationType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, PartiesNotify, PartiesRespond } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';

/**
 * Check if response is required for the user
 * @param notification SendNotificationType
 * @param user UserDetails
 */
export const isResponseRequired = (notification: SendNotificationType, user: UserDetails): boolean => {
  if (!notification) {
    return false;
  }

  const { sendNotificationNotify, sendNotificationSelectParties, respondCollection } = notification;
  const isNotifyingRespondent =
    sendNotificationNotify === PartiesNotify.BOTH_PARTIES || sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY;
  const isRespondentSelected =
    sendNotificationSelectParties === PartiesRespond.BOTH_PARTIES ||
    sendNotificationSelectParties === PartiesRespond.RESPONDENT;
  if (!isNotifyingRespondent || !isRespondentSelected) {
    return false;
  }

  const hasResponded = respondCollection?.some(
    r => r.value.from === Applicant.RESPONDENT && r.value.fromIdamId === user.id
  );
  return !hasResponded;
};

/**
 * Check if sendNotification is visible to the user
 * @param item SendNotificationType
 */
export const isNotificationVisible = (item: SendNotificationType): boolean => {
  if (
    item.sendNotificationNotify === PartiesNotify.BOTH_PARTIES ||
    item.sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY
  ) {
    return true;
  }
  if (item.respondNotificationTypeCollection?.some(r => isTribunalResponseShare(r.value))) {
    return true;
  }
  return !!item.respondCollection?.some(r => isOtherPartyResponseShare(r.value));
};

const isTribunalResponseShare = (response: RespondNotificationType): boolean => {
  if (!response) {
    return false;
  }
  return (
    response.respondNotificationPartyToNotify === PartiesNotify.BOTH_PARTIES ||
    response.respondNotificationPartyToNotify === PartiesNotify.RESPONDENT_ONLY
  );
};

const isOtherPartyResponseShare = (response: PseResponseType): boolean => {
  if (!response) {
    return false;
  }
  return response.copyToOtherParty === YesOrNo.YES;
};

/**
 * Get visible sendNotification Collection for the user
 * @param notifications SendNotificationTypeItem
 */
export const getVisibleSendNotifications = (notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] => {
  return notifications?.filter(it => isNotificationVisible(it.value)) || [];
};

/**
 * Get notification state for the user
 * @param notification
 * @param user
 */
export const getNotificationState = (notification: SendNotificationType, user: UserDetails): LinkStatus => {
  const existingState = notification?.respondentState?.find(state => state.value.userIdamId === user.id);
  if (existingState?.value?.notificationState) {
    return existingState.value.notificationState as LinkStatus;
  }
  if (notification.sendNotificationSelectParties !== PartiesRespond.CLAIMANT) {
    return LinkStatus.NOT_STARTED_YET;
  }
  return LinkStatus.NOT_VIEWED;
};
