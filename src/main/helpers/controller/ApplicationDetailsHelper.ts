import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../dateInLocale';

import { getApplicationDisplayByCode } from './ContactTribunalHelper';

/**
 * Display details of selected application.
 * @param app selected application
 * @param req request
 */
export const getApplicationContent = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[] => {
  const translations = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  try {
    return getTseApplicationDetails(app, req.url, translations);
  } catch (error) {
    return undefined;
  }
};

const getTseApplicationDetails = (
  app: GenericTseApplicationTypeItem,
  url: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const application = app.value;
  const applicationDate = datesStringToDateInLocale(application.date, url);

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
    // TODO: Create Download Link
    const downloadLink = 'link';
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, downloadLink));
  }

  rows.push(addSummaryRow(translations.copyCorrespondence, translations[application.copyToOtherPartyYesOrNo]));

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};

/**
 * Boolean if respond to Tribunal is required.
 * @param app selected application
 */
export const isResponseToTribunalRequired = (app: GenericTseApplicationTypeItem): boolean => {
  return app.value.claimantResponseRequired === YesOrNo.YES;
};
