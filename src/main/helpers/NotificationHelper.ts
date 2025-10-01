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
 * @param item SendNotificationType
 */
export const isResponseRequireSelected = (item: SendNotificationType): boolean => {
  return (
    item?.sendNotificationSelectParties === PartiesRespond.BOTH_PARTIES ||
    item?.sendNotificationSelectParties === PartiesRespond.RESPONDENT
  );
};

/**
 * Check if respondent is notified by the tribunal
 * @param item SendNotificationType
 */
const isNotificationNotified = (item: SendNotificationType): boolean => {
  return (
    item?.sendNotificationNotify === PartiesNotify.BOTH_PARTIES ||
    item?.sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY
  );
};

/**
 * Check if response is shared to the respondent by the tribunal
 * @param item SendNotificationType
 */
const isTribunalResponseNotified = (item: RespondNotificationType): boolean => {
  return (
    item?.respondNotificationPartyToNotify === PartiesNotify.BOTH_PARTIES ||
    item?.respondNotificationPartyToNotify === PartiesNotify.RESPONDENT_ONLY
  );
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
    isNotificationNotified(item) ||
    hasTribunalResponseShared(item.respondNotificationTypeCollection) ||
    hasOtherPartyResponseShared(item.respondCollection)
  );
};

const hasTribunalResponseShared = (responseList: TypeItem<RespondNotificationType>[]): boolean => {
  return responseList?.some(r => isTribunalResponseNotified(r.value)) ?? false;
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
  if (isResponseRequireSelected(notification)) {
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
