import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get Respond to Tribunal Check your answer content
 * @param req request
 * @param translations translations
 */
export const getCyaContent = (req: AppRequest, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const userCase = req.session.userCase;
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.responseText,
      PageUrls.RESPOND_TO_TRIBUNAL.replace(':appId', userCase.selectedGenericTseApplication.id) + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.hasSupportingMaterial === YesOrNo.YES) {
    // TODO: Create Download Link
    const downloadLink = 'link';
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        downloadLink,
        PageUrls.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL + languageParam,
        translations.change,
        ''
      )
    );
  }

  rows.push(
    addSummaryRowWithAction(
      translations.copyToOtherPartyYesOrNo,
      userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
      PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyText,
        userCase.copyToOtherPartyText,
        PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + languageParam,
        translations.change,
        ''
      )
    );
  }

  return rows;
};
