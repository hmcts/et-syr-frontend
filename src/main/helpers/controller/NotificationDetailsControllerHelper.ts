import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  PseResponseType,
  RespondNotificationType,
  SendNotificationType,
} from '../../definitions/complexTypes/sendNotificationTypeItem';
import { IsCmoOrRequest, PartiesNotify, TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { LinkStatus } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
import {
  getExistingNotificationState,
  isPartiesRespondRequired,
  isRespondNotificationPartyToNotify,
} from '../NotificationHelper';
import { datesStringToDateInLocale } from '../dateInLocale';

export interface NotificationResponse {
  date: Date;
  rows: SummaryListRow[];
}

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

const hasUserRespond = (notification: SendNotificationType, user: UserDetails): boolean => {
  return notification ? notification.respondCollection?.some(state => state.value.fromIdamId === user.id) : false;
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
      notification.sendNotificationSubject.map(key => translations[key] || key).join(', ')
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

/**
 * Get all responses in respondCollection
 * @param notification selected SendNotificationType
 * @param req request
 */
export const getNotificationResponses = (
  notification: SendNotificationType,
  req: AppRequest
): NotificationResponse[] => {
  const { user } = req.session;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
  };
  const rows: NotificationResponse[] = [];

  (notification?.respondCollection ?? [])
    .filter(r => r.value.copyToOtherParty === YesOrNo.YES || r.value.fromIdamId === user.id)
    .forEach(r => {
      rows.push(addNonAdminResponse(r.value, translations, req));
    });

  (notification?.respondNotificationTypeCollection ?? [])
    .filter(r => isRespondNotificationPartyToNotify(r.value))
    .forEach(r => {
      rows.push(addAdminResponse(r.value, translations, req));
    });

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());

  (notification?.respondentRespondStoredCollection ?? [])
    .filter(r => r.value.fromIdamId === user.id)
    .forEach(r => {
      rows.push(addNonAdminResponse(r.value, translations, req));
    });

  return rows;
};

const addNonAdminResponse = (
  response: PseResponseType,
  translations: AnyRecord,
  req: AppRequest
): NotificationResponse => {
  const rowsToDisplay: SummaryListRow[] = [];

  rowsToDisplay.push(
    addSummaryRow(translations.responder, translations[response.from]),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.date, req.url))
  );

  if (response.response) {
    rowsToDisplay.push(addSummaryRow(translations.response, response.response));
  }

  if (response.supportingMaterial) {
    const docType = getDocumentFromDocumentTypeItems(response.supportingMaterial);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rowsToDisplay.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  if (response.copyToOtherParty) {
    rowsToDisplay.push(addSummaryRow(translations.copyCorrespondence, translations[response.copyToOtherParty]));
  }

  return {
    date: new Date(response.dateTime ?? response.date),
    rows: rowsToDisplay,
  };
};

const addAdminResponse = (
  response: RespondNotificationType,
  translations: AnyRecord,
  req: AppRequest
): NotificationResponse => {
  if (response.respondNotificationPartyToNotify === PartiesNotify.CLAIMANT_ONLY) {
    return;
  }

  const rowsToDisplay: SummaryListRow[] = [];

  rowsToDisplay.push(
    addSummaryRow(translations.responseItem, response.respondNotificationTitle),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.respondNotificationDate, req.url)),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.orderOrRequest, translations[response.respondNotificationCmoOrRequest]),
    addSummaryRow(translations.responseDue, translations[response.respondNotificationResponseRequired]),
    addSummaryRow(translations.partyToRespond, translations[response.respondNotificationWhoRespond])
  );

  if (response.respondNotificationAdditionalInfo) {
    rowsToDisplay.push(addSummaryRow(translations.additionalInfo, response.respondNotificationAdditionalInfo));
  }

  response.respondNotificationUploadDocument?.forEach(doc => {
    const link = getLinkFromDocument(doc.value.uploadedDocument);
    rowsToDisplay.push(
      addSummaryRow(translations.description, doc.value.shortDescription),
      addSummaryHtmlRow(translations.document, link)
    );
  });

  rowsToDisplay.push(
    addSummaryRow(
      translations.requestMadeBy,
      response.respondNotificationRequestMadeBy === IsCmoOrRequest.REQUEST
        ? translations[response.respondNotificationRequestMadeBy]
        : translations[response.respondNotificationCaseManagementMadeBy]
    ),
    addSummaryRow(translations.fullName, response.respondNotificationFullName),
    addSummaryRow(translations.sentTo, translations[response.respondNotificationPartyToNotify])
  );

  return {
    date: new Date(response.dateTime ?? response.respondNotificationDate),
    rows: rowsToDisplay,
  };
};

/**
 * Check if any response is required from claimant
 * @param newStatus new link status after viewed
 * @param notification selected SendNotificationType
 * @param user user details
 */
export const isRespondButton = (
  newStatus: LinkStatus,
  notification: SendNotificationType,
  user: UserDetails
): boolean => {
  const existingState = newStatus || getExistingNotificationState(notification, user);
  return existingState === LinkStatus.NOT_STARTED_YET;
};

/**
 * Get single response display details
 * @param response
 * @param req
 */
export const getSinglePseResponseDisplay = (response: PseResponseType, req: AppRequest): SummaryListRow[] => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
  };
  return addNonAdminResponse(response, translations, req).rows;
};
