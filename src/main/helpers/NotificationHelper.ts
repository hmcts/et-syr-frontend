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
 * Check if response is required for the user
 * @param notification SendNotificationType
 * @param user UserDetails
 */
export const isResponseRequired = (notification: SendNotificationType, user: UserDetails): boolean => {
  if (!notification) {
    return false;
  }

  const { sendNotificationNotify, sendNotificationSelectParties, respondCollection } = notification;
  if (
    !isRespondentNotified(sendNotificationNotify) ||
    !isResponseRequiredFromRespondent(sendNotificationSelectParties)
  ) {
    return false;
  }

  return !hasUserResponded(respondCollection, user.id);
};

const isRespondentNotified = (sendNotificationNotify: string): boolean => {
  return (
    sendNotificationNotify === PartiesNotify.BOTH_PARTIES || sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY
  );
};

const isResponseRequiredFromRespondent = (sendNotificationSelectParties: string): boolean => {
  return (
    sendNotificationSelectParties === PartiesRespond.BOTH_PARTIES ||
    sendNotificationSelectParties === PartiesRespond.RESPONDENT
  );
};

const hasUserResponded = (respondCollection: TypeItem<PseResponseType>[], userId: string): boolean => {
  return respondCollection
    ? respondCollection.some(r => r?.value?.from === Applicant.RESPONDENT && r.value?.fromIdamId === userId)
    : false;
};

/**
 * Check if sendNotification is visible to the user
 * @param item SendNotificationType
 */
export const isNotificationVisible = (item: SendNotificationType): boolean => {
  return (
    isRespondentNotified(item.sendNotificationNotify) ||
    hasTribunalResponseShared(item.respondNotificationTypeCollection) ||
    hasOtherPartyResponseShared(item.respondCollection)
  );
};

const hasTribunalResponseShared = (responseList: TypeItem<RespondNotificationType>[]): boolean => {
  return responseList?.some(r => isTribunalResponseShared(r.value)) ?? false;
};

const isTribunalResponseShared = (response: RespondNotificationType): boolean => {
  return response ? isRespondentNotified(response.respondNotificationPartyToNotify) : false;
};

const hasOtherPartyResponseShared = (responseList: TypeItem<PseResponseType>[]): boolean => {
  return responseList?.some(r => isOtherPartyResponseShared(r.value)) ?? false;
};

const isOtherPartyResponseShared = (response: PseResponseType): boolean => {
  return response ? response.copyToOtherParty === YesOrNo.YES : false;
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
  if (isResponseRequiredFromRespondent(notification.sendNotificationSelectParties)) {
    return LinkStatus.NOT_STARTED_YET;
  }
  return LinkStatus.NOT_VIEWED;
};
