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
import { isTypeAOrB } from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Get Respond to Application Check your answer content
 * @param req request
 */
export const getCyaContent = (req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.RESPOND_TO_APPLICATION_CYA, { returnObjects: true }),
  };
  const userCase = req.session.userCase;
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.responseText || translations.notProvided,
      PageUrls.RESPOND_TO_APPLICATION.replace(':appId', userCase.selectedGenericTseApplication.id) + languageParam,
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
        PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL + languageParam,
        translations.change,
        ''
      )
    );
  }

  if (isTypeAOrB(userCase.selectedGenericTseApplication.value)) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
        PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY + languageParam,
        translations.change,
        ''
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRowWithAction(
          translations.copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY + languageParam,
          translations.change,
          ''
        )
      );
    }
  }

  return rows;
};
