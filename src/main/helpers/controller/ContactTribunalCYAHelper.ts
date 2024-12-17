import { AppRequest } from '../../definitions/appRequest';
import { Document, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getDocId, getFileExtension } from '../ApiFormatter';
import { getApplicationByCode, getApplicationKey, isTypeAOrB } from '../ApplicationHelper';
import { formatBytes } from '../DocumentHelpers';

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
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        createDownloadLink(userCase.contactApplicationFile),
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

const createDownloadLink = (file: Document): string => {
  if (!file?.document_size || !file.document_mime_type || !file.document_filename) {
    return '';
  }
  const mimeType = getFileExtension(file.document_filename);
  const href = `/getSupportingMaterial/${getDocId(file.document_url)}`;
  const size = formatBytes(file.document_size);
  return `<a href='${href}' target='_blank' class='govuk-link'>${file.document_filename} (${mimeType}, ${size})</a>`;
};
