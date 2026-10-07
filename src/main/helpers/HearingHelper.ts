import { HearingModel } from '../definitions/api/caseApiResponse';
import { AppRequest, UserDetails } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects, PageUrls, PartiesNotify, TranslationKeys } from '../definitions/constants';
import { HearingDateRow, HearingDetails, HearingNotificationRow } from '../definitions/hearingDetails';
import { linkStatusColorMap } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';

import { getExistingNotificationState } from './NotificationHelper';
import { getLanguageParam } from './RouterHelpers';

/**
 * Get hearing data to display in Hearing Details page
 * @param req request
 */
export const getHearingCollection = (req: AppRequest): HearingDetails[] => {
  const list: HearingDetails[] = [];
  const { userCase, user } = req.session;
  const hearings = userCase.hearingCollection || [];
  const notifications = userCase.sendNotificationCollection || [];
  const languageParam = getLanguageParam(req.url);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
  };
  const hearingNotifications = getHearingNotificationsToRespondent(notifications);
  for (const hearing of hearings) {
    const details: HearingDetails = {
      hearingNumber: hearing.value?.hearingNumber,
      hearingType: translations[hearing.value?.Hearing_type],
      hearingDateRows: getHearingDateRows(hearing, translations),
      notifications: getMatchedNotifications(hearingNotifications, hearing, user, languageParam, translations),
    };
    list.push(details);
  }
  return list;
};

const getHearingNotificationsToRespondent = (notifications: SendNotificationTypeItem[]): SendNotificationTypeItem[] =>
  notifications.filter(notification => isForRespondent(notification) && isForHearing(notification));

const isForRespondent = (notification: SendNotificationTypeItem): boolean =>
  notification.value?.sendNotificationNotify === PartiesNotify.RESPONDENT_ONLY ||
  notification.value?.sendNotificationNotify === PartiesNotify.BOTH_PARTIES;

const isForHearing = (notification: SendNotificationTypeItem): boolean =>
  notification.value?.sendNotificationSubject?.includes(NotificationSubjects.HEARING) ?? false;

const getHearingDateRows = (hearing: HearingModel, translations: AnyRecord): HearingDateRow[] =>
  hearing.value?.hearingDateCollection?.map(hearingDate => ({
    date: hearingDate.value?.listedDate,
    status: translations[hearingDate.value?.Hearing_status],
    venue: hearingDate.value?.hearingVenueDay?.value.label || '',
  })) ?? [];

const getMatchedNotifications = (
  notifications: SendNotificationTypeItem[],
  hearing: HearingModel,
  user: UserDetails,
  languageParam: string,
  translations: AnyRecord
): HearingNotificationRow[] =>
  notifications
    .filter(notification => doesNotificationMatchHearing(hearing, notification))
    .map(notification => getNotificationRow(notification, user, languageParam, translations));

const doesNotificationMatchHearing = (hearing: HearingModel, notification: SendNotificationTypeItem): boolean =>
  hearing.value?.hearingDateCollection?.some(
    hearingDate => hearingDate.id === notification.value?.sendNotificationSelectHearing?.selectedCode
  ) ?? false;

const getNotificationRow = (
  notification: SendNotificationTypeItem,
  user: UserDetails,
  languageParam: string,
  translations: AnyRecord
): HearingNotificationRow => {
  const notificationState = getExistingNotificationState(notification.value, user);
  return {
    date: notification.value?.date,
    redirectUrl: PageUrls.NOTIFICATION_DETAILS.replace(':itemId', notification.id) + languageParam,
    notificationTitle: notification.value?.sendNotificationTitle,
    displayStatus: translations[notificationState],
    statusColor: linkStatusColorMap.get(notificationState),
  };
};
