import { AppRequest, UserDetails } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import {
  PseResponseType,
  RespondNotificationType,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls, PartiesNotify, PartiesRespond } from '../definitions/constants';
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
 * Check if tribunal response is shared with respondent
 * @param item RespondNotificationType
 */
export const isRespondNotificationPartyToNotify = (item: RespondNotificationType): boolean => {
  return (
    item.respondNotificationPartyToNotify === PartiesNotify.BOTH_PARTIES ||
    item.respondNotificationPartyToNotify === PartiesNotify.RESPONDENT_ONLY
  );
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
  return responseList?.some(r => isRespondNotificationPartyToNotify(r.value)) ?? false;
};

const hasOtherPartyResponseShared = (responseList: TypeItem<PseResponseType>[]): boolean => {
  return responseList?.some(r => r.value.copyToOtherParty === YesOrNo.YES) ?? false;
};

/**
 * Return selected notification
 * @param items
 * @param notificationId
 */
export const findSelectedSendNotification = (
  items: SendNotificationTypeItem[],
  notificationId: string
): SendNotificationTypeItem => {
  return items?.find(it => it.id === notificationId);
};

/**
 * Return selected notification response
 * @param item selected notification
 * @param responseId selected response id
 * @param user current user details
 */
export const findSelectedStoredPseResponse = (
  item: SendNotificationType,
  responseId: string,
  user: UserDetails
): TypeItem<PseResponseType> => {
  return item?.respondentRespondStoredCollection?.find(it => it.id === responseId && it.value.fromIdamId === user.id);
};

/**
 * Get existing notification state for the current user
 * @param notification selected SendNotificationType
 * @param user user details
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

/**
 * Get notification details url
 * @param item SendNotificationTypeItem
 */
export const getNotificationDetailsUrl = (item: SendNotificationTypeItem): string => {
  return PageUrls.NOTIFICATION_DETAILS.replace(':itemId', item.id);
};
