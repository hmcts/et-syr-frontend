import { CaseWithId } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';
import { getApplicationDisplayByCode } from './controller/ContactTribunalHelper';
import { datesStringToDateInLocale } from './dateInLocale';

export const findSelectedGenericTseApplication = (
  items: GenericTseApplicationTypeItem[],
  param: string
): GenericTseApplicationTypeItem => {
  return items?.find(it => it.id === param);
};

export const getAllTseApplicationCollection = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  const returnCollection: GenericTseApplicationTypeItem[] = [];
  if (userCase.genericTseApplicationCollection !== undefined) {
    returnCollection.push(...userCase.genericTseApplicationCollection);
  }
  return returnCollection;
};

export const getTseApplicationDetails = (
  selectedApplication: GenericTseApplicationTypeItem,
  reqUrl: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const application = selectedApplication.value;
  const applicationDate = datesStringToDateInLocale(application.date, reqUrl);

  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.applicant, translations[application.applicant]),
    addSummaryRow(translations.requestDate, applicationDate),
    addSummaryRow(translations.applicationType, getApplicationDisplayByCode(application.type, translations))
  );

  if (application.details) {
    rows.push(addSummaryRow(translations.legend, application.details));
  }

  if (application.documentUpload) {
    const downloadLink = createDownloadLink(application.documentUpload);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, downloadLink));
  }

  rows.push(addSummaryRow(translations.copyCorrespondence, translations[application.copyToOtherPartyYesOrNo]));

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};
