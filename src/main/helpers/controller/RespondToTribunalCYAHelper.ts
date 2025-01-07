import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getCyaContent = (request: AppRequest, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const userCase = request.session.userCase;

  rows.push(
    addSummaryRowWithAction(
      translations.legend,
      userCase.responseText,
      PageUrls.RESPOND_TO_TRIBUNAL,
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
        PageUrls.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL,
        translations.change,
        ''
      )
    );
  }

  rows.push(
    addSummaryRowWithAction(
      translations.copyToOtherPartyYesOrNo,
      userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
      PageUrls.COPY_TO_OTHER_PARTY,
      translations.change,
      ''
    )
  );

  if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyText,
        userCase.copyToOtherPartyText,
        PageUrls.COPY_TO_OTHER_PARTY,
        translations.change,
        ''
      )
    );
  }

  return rows;
};
