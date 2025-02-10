import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecision,
  TseAdminDecisionItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties, TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import CollectionUtils from '../../utils/CollectionUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
import { datesStringToDateInLocale } from '../dateInLocale';

import { isClaimantAppShare } from './ClaimantsApplicationsHelper';
import { getApplicationDisplayByCode } from './ContactTribunalHelper';

/**
 * Check if this application is visible to user
 * @param app selected application
 */
export const isApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
  return app.value?.applicant === Applicant.RESPONDENT || isClaimantAppShare(app);
};

/**
 * Display details of selected application.
 * @param app selected application
 * @param req request
 */
export const getApplicationContent = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[] => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  const application = app.value;
  const applicationDate = datesStringToDateInLocale(application.date, req.url);

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

/**
 * Check if tribunal response is shared to respondent
 * @param response response
 */
export const isAdminResponseShareToRespondent = (response: TseRespondTypeItem): boolean => {
  return (
    response.value?.from === Applicant.ADMIN &&
    (response.value?.selectPartyNotify === Parties.BOTH_PARTIES ||
      response.value?.selectPartyNotify === Parties.RESPONDENT_ONLY)
  );
};

/**
 * Get all responses in respondCollection
 * @param app selected GenericTseApplicationTypeItem
 * @param req request
 */
export const getAllResponses = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[][] => {
  const allResponses: SummaryListRow[][] = [];

  const respondCollection = app.value.respondCollection;
  if (!respondCollection?.length) {
    return allResponses;
  }

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };

  for (const response of respondCollection) {
    if (isRespondentResponse(response) || isClaimantResponseWithCopyYes(response)) {
      allResponses.push(addNonAdminResponse(response, translations, req));
    } else if (isAdminResponseShareToRespondent(response)) {
      allResponses.push(addAdminResponse(response, translations, req));
    }
  }

  return allResponses;
};

const isRespondentResponse = (response: TseRespondTypeItem): boolean => {
  return response.value.from === Applicant.RESPONDENT;
};

const isClaimantResponseWithCopyYes = (response: TseRespondTypeItem): boolean => {
  return response.value.from === Applicant.CLAIMANT && response.value.copyToOtherParty === YesOrNo.YES;
};

const addNonAdminResponse = (
  response: TseRespondTypeItem,
  translations: AnyRecord,
  req: AppRequest
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.responseFrom, translations[response.value.from]),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.value.date, req.url)),
    addSummaryRow(translations.responseText, response.value.response)
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
 * Check if decision is shared to respondent
 * @param decision decision
 */
export const isDecisionShareToRespondent = (decision: TseAdminDecisionItem): boolean => {
  return (
    decision.value?.selectPartyNotify === Parties.BOTH_PARTIES ||
    decision.value?.selectPartyNotify === Parties.RESPONDENT_ONLY
  );
};

/**
 * Get selected application decision
 * @param app selected application
 * @param req request
 */
export const getDecisionContent = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[][] => {
  const selectedAppAdminDecision = app.value?.adminDecision?.filter(d => isDecisionShareToRespondent(d));
  if (ObjectUtils.isEmpty(selectedAppAdminDecision)) {
    return [];
  }

  const allResponses: SummaryListRow[][] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };

  for (const item of selectedAppAdminDecision) {
    allResponses.push(getTseApplicationDecisionDetails(item.value, translations, req));
  }
  return allResponses;
};

const getTseApplicationDecisionDetails = (
  decision: TseAdminDecision,
  translations: AnyRecord,
  req: AppRequest
): SummaryListRow[] => {
  const rows = [];
  rows.push(
    addSummaryRow(translations.notification, decision.enterNotificationTitle),
    addSummaryRow(translations.decision, translations[decision.decision]),
    addSummaryRow(translations.date, datesStringToDateInLocale(decision.date, req.url)),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.decisionType, translations[decision.typeOfDecision]),
    addSummaryRow(translations.additionalInfo, decision.additionalInformation)
  );

  if (CollectionUtils.isNotEmpty(decision.responseRequiredDoc)) {
    const docLinks: string[] = [];
    decision.responseRequiredDoc.forEach(d => docLinks.push(getLinkFromDocument(d.value.uploadedDocument)));
    rows.push(addSummaryHtmlRow(translations.document, docLinks.join('')));
  }

  rows.push(
    addSummaryRow(translations.decisionMadeBy, translations[decision.decisionMadeBy]),
    addSummaryRow(translations.name, decision.decisionMadeByFullName),
    addSummaryRow(translations.sentTo, translations[decision.selectPartyNotify])
  );

  return rows;
};

/**
 * Boolean if respond to Application is required.
 * @param app selected application
 */
export const isResponseToTribunalRequired = (app: GenericTseApplicationTypeItem): boolean => {
  return app.value.respondentResponseRequired === YesOrNo.YES;
};
