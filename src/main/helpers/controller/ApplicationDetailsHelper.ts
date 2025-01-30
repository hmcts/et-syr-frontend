import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties, TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
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
  return getTseApplicationDetails(app, req.url, translations);
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
    const link = getLinkFromDocument(application.documentUpload);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  rows.push(addSummaryRow(translations.copyCorrespondence, translations[application.copyToOtherPartyYesOrNo]));

  if (application.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, application.copyToOtherPartyText));
  }

  return rows;
};

export const getAllResponses = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[][] => {
  const allResponses: SummaryListRow[][] = [];

  const respondCollection = app.value.respondCollection;
  if (!respondCollection?.length) {
    return allResponses;
  }

  const translations = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };

  for (const response of respondCollection) {
    if (isResponseFromRespondent(response) || isResponseFromClaimantWithCopyYes(response)) {
      allResponses.push(addNonAdminResponse(response, translations, req));
    } else if (isResponseFromTribunalToRespondent(response)) {
      allResponses.push(addAdminResponse(response, translations, req));
    }
  }

  return allResponses;
};

const isResponseFromRespondent = (response: TseRespondTypeItem): boolean => {
  return response.value.from === Applicant.RESPONDENT;
};

const isResponseFromClaimantWithCopyYes = (response: TseRespondTypeItem): boolean => {
  return response.value.from === Applicant.CLAIMANT && response.value.copyToOtherParty === YesOrNo.YES;
};

const isResponseFromTribunalToRespondent = (response: TseRespondTypeItem): boolean => {
  return (
    response.value.from === Applicant.ADMIN &&
    (response.value.selectPartyNotify === Parties.RESPONDENT_ONLY ||
      response.value.selectPartyNotify === Parties.BOTH_PARTIES)
  );
};

const addNonAdminResponse = (
  response: TseRespondTypeItem,
  translations: AnyRecord,
  req: AppRequest
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.responder, translations[response.value.from]),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.value.date, req.url)),
    addSummaryRow(translations.response, response.value.response)
  );

  if (response.value.supportingMaterial) {
    const docType = getDocumentFromDocumentTypeItems(response.value.supportingMaterial);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  if (response.value.copyToOtherParty) {
    rows.push(addSummaryRow(translations.copyCorrespondence, translations[response.value.copyToOtherParty]));
  }

  return rows;
};

const addAdminResponse = (response: TseRespondTypeItem, translations: AnyRecord, req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  if (response.value.enterResponseTitle) {
    rows.push(addSummaryRow(translations.responseItem, response.value.enterResponseTitle));
  }

  rows.push(
    addSummaryRow(translations.date, datesStringToDateInLocale(response.value.date, req.url)),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.orderOrRequest, translations[response.value.isCmoOrRequest])
  );

  if (response.value.isResponseRequired) {
    rows.push(addSummaryRow(translations.responseDue, translations[response.value.isResponseRequired]));
  }

  if (response.value.selectPartyRespond) {
    rows.push(addSummaryRow(translations.partyToRespond, translations[response.value.selectPartyRespond]));
  }

  if (response.value.additionalInformation) {
    rows.push(addSummaryRow(translations.additionalInfo, response.value.additionalInformation));
  }

  if (response.value.addDocument) {
    const docType = getDocumentFromDocumentTypeItems(response.value.addDocument);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rows.push(
      addSummaryRow(translations.description, docType.shortDescription),
      addSummaryHtmlRow(translations.document, link)
    );
  }

  if (response.value.requestMadeBy) {
    rows.push(addSummaryRow(translations.requestMadeBy, translations[response.value.requestMadeBy]));
  } else if (response.value.cmoMadeBy) {
    rows.push(addSummaryRow(translations.requestMadeBy, translations[response.value.cmoMadeBy]));
  }

  if (response.value.madeByFullName) {
    rows.push(addSummaryRow(translations.name, response.value.madeByFullName));
  }

  rows.push(addSummaryRow(translations.sentTo, translations[response.value.selectPartyNotify]));

  return rows;
};

/**
 * Boolean if respond to Tribunal is required.
 * @param app selected application
 */
export const isResponseToTribunalRequired = (app: GenericTseApplicationTypeItem): boolean => {
  return app.value.respondentResponseRequired === YesOrNo.YES;
};
