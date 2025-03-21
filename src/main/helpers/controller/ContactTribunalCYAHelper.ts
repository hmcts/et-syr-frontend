import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getApplicationByCode, getApplicationKey, isTypeAOrB } from '../ApplicationHelper';
import { getSupportingMaterialLink } from '../DocumentHelpers';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get Contact Tribunal Check your answer content
 * @param req request
 * */
export const getCyaContent = (req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CONTACT_TRIBUNAL_CYA, { returnObjects: true }),
  };
  const userCase = req.session.userCase;
  const selectedApplication = getApplicationByCode(userCase.contactApplicationType);
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.applicationType,
      translations.respondentAppName[getApplicationKey(selectedApplication)] || '',
      PageUrls.CONTACT_TRIBUNAL + languageParam,
      translations.change,
      ''
    )
  );

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.contactApplicationText || translations.notProvided,
      PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url) + languageParam,
      translations.change,
      ''
    )
  );

  const link = getSupportingMaterialLink(userCase.contactApplicationFile);
  rows.push(
    addSummaryHtmlRowWithAction(
      translations.supportingMaterial,
      link || translations.notProvided,
      PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url) + languageParam,
      translations.change,
      ''
    )
  );

  if (isTypeAOrB(selectedApplication)) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
        PageUrls.COPY_TO_OTHER_PARTY + languageParam,
        translations.change,
        ''
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRowWithAction(
          translations.copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          PageUrls.COPY_TO_OTHER_PARTY + languageParam,
          translations.change,
          ''
        )
      );
    }
  }

  return rows;
};
