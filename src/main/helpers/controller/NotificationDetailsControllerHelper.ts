import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PseResponseType, SendNotificationType } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { LinkStatus } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
import { getExistingNotificationState, hasUserRespond, isPartiesRespondRequired } from '../NotificationHelper';
import { datesStringToDateInLocale } from '../dateInLocale';

/**
 * Get new notification status after user viewed in Notification Details page
 * @param notification selected SendNotificationType
 * @param user user details
 */
export const getNotificationStatusAfterViewed = (notification: SendNotificationType, user: UserDetails): LinkStatus => {
  if (!notification || !user) {
    return;
  }

  const existingState = getExistingNotificationState(notification, user);
  if (existingState === LinkStatus.NOT_VIEWED) {
    return isPartiesRespondRequired(notification) && !hasUserRespond(notification, user)
      ? LinkStatus.NOT_STARTED_YET
      : LinkStatus.VIEWED;
  }
};

/**
 * Get notification content for the user
 * @param notification selected SendNotificationType
 * @param req request
 */
export const getNotificationContent = (notification: SendNotificationType, req: AppRequest): SummaryListRow[] => {
  const { url } = req;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
  };
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.notificationSubject,
      formatNotificationSubjects(notification.sendNotificationSubject, translations)
    ),
    addSummaryRow(translations.dateSent, datesStringToDateInLocale(notification.date, url)),
    addSummaryRow(translations.sentBy, translations.tribunal)
  );

  if (notification.sendNotificationCaseManagement) {
    rows.push(
      addSummaryRow(translations.orderOrRequest, translations[notification.sendNotificationCaseManagement]),
      addSummaryRow(translations.responseDue, translations[notification.sendNotificationResponseTribunal])
    );
    if (notification.sendNotificationResponseTribunal?.startsWith(YesOrNo.YES)) {
      rows.push(addSummaryRow(translations.partyToRespond, translations[notification.sendNotificationSelectParties]));
    }
  }

  if (notification.sendNotificationAdditionalInfo) {
    rows.push(addSummaryRow(translations.addInfo, notification.sendNotificationAdditionalInfo));
  }

  if (notification.sendNotificationUploadDocument?.length) {
    notification.sendNotificationUploadDocument.forEach(doc => {
      rows.push(
        addSummaryRow(translations.description, doc.value.shortDescription),
        addSummaryHtmlRow(translations.document, getLinkFromDocument(doc.value.uploadedDocument))
      );
    });
  }

  if (notification.sendNotificationWhoCaseOrder) {
    rows.push(
      addSummaryRow(translations.orderMadeBy, translations[notification.sendNotificationWhoCaseOrder]),
      addSummaryRow(translations.fullName, notification.sendNotificationFullName)
    );
  } else if (notification.sendNotificationRequestMadeBy) {
    rows.push(
      addSummaryRow(translations.requestMadeBy, translations[notification.sendNotificationRequestMadeBy]),
      addSummaryRow(translations.fullName, notification.sendNotificationFullName)
    );
  }

  rows.push(addSummaryRow(translations.sentTo, translations[notification.sendNotificationNotify]));

  return rows;
};

const formatNotificationSubjects = (keys: string[] = [], translations: AnyRecord): string => {
  return keys.map(key => translations[key] || key).join(', ');
};

/**
 * Get all responses in respondCollection
 * @param notification selected SendNotificationType
 * @param req request
 */
export const getNonAdminResponses = (notification: SendNotificationType, req: AppRequest): SummaryListRow[][] => {
  if (!notification || ObjectUtils.isEmpty(notification.respondCollection)) {
    return [];
  }

  const { user } = req.session;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
  };
  const rows: SummaryListRow[][] = [];

  notification.respondCollection
    .filter(r => r.value.copyToOtherParty === YesOrNo.YES || r.value.fromIdamId === user.id)
    .forEach(r => {
      rows.push(addNonAdminResponse(r.value, translations, req));
    });

  return rows;
};

const addNonAdminResponse = (response: PseResponseType, translations: AnyRecord, req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.responder, translations[response.from]),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.date, req.url))
  );

  if (response.response) {
    rows.push(addSummaryRow(translations.response, response.response));
  }

  if (response.supportingMaterial) {
    const docType = getDocumentFromDocumentTypeItems(response.supportingMaterial);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  if (response.copyToOtherParty) {
    rows.push(addSummaryRow(translations.copyCorrespondence, translations[response.copyToOtherParty]));
  }

  return rows;
};

/**
 * Check if any response is required from claimant
 * @param notification selected SendNotificationType
 * @param user user details
 */
export const isRespondButton = (notification: SendNotificationType, user: UserDetails): boolean => {
  const existingState = getExistingNotificationState(notification, user);
  if (existingState === LinkStatus.NOT_STARTED_YET) {
    return true;
  }
  return false;
};
