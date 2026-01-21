import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getSupportingMaterialLink } from '../DocumentHelpers';
import { getLanguageParam } from '../RouterHelpers';

import { getRespondNotificationCopyPage } from './RespondToNotificationControllerHelper';

/**
 * Get Respond to Notification check your answer content
 * @param req request
 */
export const getNotificationCyaContent = (req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.RESPOND_TO_APPLICATION_CYA, { returnObjects: true }),
  };
  const { userCase } = req.session;
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.responseText || translations.notProvided,
      PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', userCase.selectedNotification.id) + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.hasSupportingMaterial === YesOrNo.YES) {
    const link = getSupportingMaterialLink(userCase.supportingMaterialFile);
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        link,
        PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', userCase.selectedNotification.id) + languageParam,
        translations.change,
        ''
      )
    );
  }

  const respondNotificationCopyPage = getRespondNotificationCopyPage(userCase) + languageParam;
  rows.push(
    addSummaryRowWithAction(
      translations.copyToOtherPartyYesOrNo,
      userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
      respondNotificationCopyPage,
      translations.change,
      ''
    )
  );

  if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyText,
        userCase.copyToOtherPartyText,
        respondNotificationCopyPage,
        translations.change,
        ''
      )
    );
  }

  return rows;
};
