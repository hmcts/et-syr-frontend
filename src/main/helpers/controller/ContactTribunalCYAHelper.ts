import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getApplicationByCode, getApplicationKey, isTypeAOrB } from '../ApplicationHelper';

export const getCyaContent = (request: AppRequest, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const userCase = request.session.userCase;
  const selectedApplication = getApplicationByCode(userCase.contactApplicationType);

  rows.push(
    addSummaryRowWithAction(
      translations.applicationType,
      translations[getApplicationKey(selectedApplication)],
      PageUrls.CONTACT_TRIBUNAL,
      translations.change,
      ''
    )
  );

  if (userCase.contactApplicationText) {
    rows.push(
      addSummaryRowWithAction(
        translations.legend,
        userCase.contactApplicationText,
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url),
        translations.change,
        ''
      )
    );
  }

  if (userCase.contactApplicationFile) {
    // TODO: Create Download Link
    const downloadLink = 'link';
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        downloadLink,
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url),
        translations.change,
        ''
      )
    );
  }

  if (isTypeAOrB(selectedApplication)) {
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
  }

  return rows;
};
