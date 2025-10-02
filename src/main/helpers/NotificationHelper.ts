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
import { TypeItem } from '../definitions/util-types';

/**
 * Check if response is required from respondent
 * compare with sendNotificationSelectParties in SendNotificationType
 * @param parties sendNotificationSelectParties
 */
export const isPartiesRespondRequired = (parties: string): boolean => {
  return parties === PartiesRespond.BOTH_PARTIES || parties === PartiesRespond.RESPONDENT;
};

/**
 * Check if respondent is notified by the tribunal
 * for claimant / respondent response, compare with sendNotificationNotify in SendNotificationType
 * for tribunal response, compare with respondNotificationPartyToNotify in RespondNotificationType
 * @param parties sendNotificationNotify / respondNotificationPartyToNotify
 */
const isPartiesNotifyRequired = (parties: string): boolean => {
  return parties === PartiesNotify.BOTH_PARTIES || parties === PartiesNotify.RESPONDENT_ONLY;
};

/**
 * Check if user has already responded
 * @param respondCollection response collection
 * @param user user details
 */
export const hasUserResponded = (respondCollection: TypeItem<PseResponseType>[], user: UserDetails): boolean => {
  return respondCollection
    ? respondCollection.some(r => r?.value?.from === Applicant.RESPONDENT && r.value?.fromIdamId === user.id)
    : false;
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
    isPartiesNotifyRequired(item.sendNotificationNotify) ||
    hasTribunalResponseShared(item.respondNotificationTypeCollection) ||
    hasOtherPartyResponseShared(item.respondCollection)
  );
};

const hasTribunalResponseShared = (responseList: TypeItem<RespondNotificationType>[]): boolean => {
  return responseList?.some(r => isPartiesNotifyRequired(r.value.respondNotificationPartyToNotify)) ?? false;
};

const hasOtherPartyResponseShared = (responseList: TypeItem<PseResponseType>[]): boolean => {
  return responseList?.some(r => r.value.copyToOtherParty === YesOrNo.YES) ?? false;
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
  if (isPartiesRespondRequired(notification.sendNotificationSelectParties)) {
    return LinkStatus.NOT_STARTED_YET;
  }
  return LinkStatus.READY_TO_VIEW;
};

/**
 * Return selected application
 * @param items
 * @param orderId
 */
export const findSelectedSendNotification = (
  items: SendNotificationTypeItem[],
  orderId: string
): SendNotificationTypeItem => {
  return items?.find(it => it.id === orderId);
};
