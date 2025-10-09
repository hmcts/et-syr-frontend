import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { SendNotificationType } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { LinkStatus } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getLinkFromDocument } from '../DocumentHelpers';
import { getExistingNotificationState, isPartiesRespondRequired } from '../NotificationHelper';
import { datesStringToDateInLocale } from '../dateInLocale';

/**
 * Get new notification status after user viewed in Notification Details page
 * @param item
 * @param user
 */
export const getNotificationStatusAfterViewed = (item: SendNotificationType, user: UserDetails): LinkStatus => {
  if (!item || !user) {
    return;
  }

  const existingState = getExistingNotificationState(item, user);
  if (!existingState) {
    return isPartiesRespondRequired(item) ? LinkStatus.NOT_STARTED_YET : LinkStatus.VIEWED;
  }

  if (existingState === LinkStatus.NOT_VIEWED) {
    return LinkStatus.VIEWED;
  }
};

/**
 * Get notification content for the user
 * @param item
 * @param req
 */
export const getNotificationContent = (item: SendNotificationType, req: AppRequest): SummaryListRow[] => {
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
      formatNotificationSubjects(item.sendNotificationSubject, translations)
    ),
    addSummaryRow(translations.dateSent, datesStringToDateInLocale(item.date, url)),
    addSummaryRow(translations.sentBy, translations.tribunal)
  );

  if (item.sendNotificationCaseManagement) {
    rows.push(
      addSummaryRow(translations.orderOrRequest, translations[item.sendNotificationCaseManagement]),
      addSummaryRow(translations.responseDue, translations[item.sendNotificationResponseTribunal])
    );
    if (item.sendNotificationResponseTribunal?.startsWith(YesOrNo.YES)) {
      rows.push(addSummaryRow(translations.partyToRespond, translations[item.sendNotificationSelectParties]));
    }
  }

  if (item.sendNotificationAdditionalInfo) {
    rows.push(addSummaryRow(translations.addInfo, item.sendNotificationAdditionalInfo));
  }

  if (item.sendNotificationUploadDocument?.length) {
    item.sendNotificationUploadDocument.forEach(doc => {
      rows.push(
        addSummaryRow(translations.description, doc.value.shortDescription),
        addSummaryHtmlRow(translations.document, getLinkFromDocument(doc.value.uploadedDocument))
      );
    });
  }

  if (item.sendNotificationWhoCaseOrder) {
    rows.push(
      addSummaryRow(translations.orderMadeBy, translations[item.sendNotificationWhoCaseOrder]),
      addSummaryRow(translations.fullName, item.sendNotificationFullName)
    );
  } else if (item.sendNotificationRequestMadeBy) {
    rows.push(
      addSummaryRow(translations.requestMadeBy, translations[item.sendNotificationRequestMadeBy]),
      addSummaryRow(translations.fullName, item.sendNotificationFullName)
    );
  }

  rows.push(addSummaryRow(translations.sentTo, translations[item.sendNotificationNotify]));

  return rows;
};

const formatNotificationSubjects = (keys: string[] = [], translations: AnyRecord): string => {
  return keys.map(key => translations[key] || key).join(', ');
};
