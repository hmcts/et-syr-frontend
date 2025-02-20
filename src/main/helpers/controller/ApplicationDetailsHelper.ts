import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseAdminDecision,
  TseRespondType,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, DefaultValues, Parties, TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import CollectionUtils from '../../utils/CollectionUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import { getApplicationDisplayByCode } from '../ApplicationHelper';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
import { datesStringToDateInLocale } from '../dateInLocale';

import { isAdminResponseShareToRespondent, isDecisionShareToRespondent } from './ClaimantsApplicationsHelper';

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

  const lastAdminShareDate = getLastAdminShareDate(respondCollection);
  for (const r of respondCollection) {
    if (
      (r.value.from === Applicant.RESPONDENT || r.value.from === Applicant.CLAIMANT) &&
      isOtherPartyResponseShare(r.value, req.session.user, lastAdminShareDate)
    ) {
      allResponses.push(addNonAdminResponse(r.value, translations, req));
    } else if (r.value.from === Applicant.ADMIN && isAdminResponseShareToRespondent(r.value)) {
      allResponses.push(addAdminResponse(r.value, translations, req));
    }
  }

  return allResponses;
};

const getLastAdminShareDate = (responses: TseRespondTypeItem[]): Date => {
  return (
    responses
      .filter(
        item =>
          item.value?.from === Applicant.ADMIN &&
          (item.value?.selectPartyNotify === Parties.BOTH_PARTIES ||
            item.value?.selectPartyNotify === Parties.RESPONDENT_ONLY) &&
          item.value?.date
      )
      .map(item => new Date(item.value!.date!))
      .sort((a, b) => b.getDate() - a.getDate())[0] || null
  );
};

const isOtherPartyResponseShare = (response: TseRespondType, user: UserDetails, lastAdminShareDate: Date): boolean => {
  if (response.fromIdamId && response.fromIdamId === user.id) {
    return true;
  }
  if (response.copyToOtherParty === YesOrNo.YES) {
    return true;
  }
  return new Date(response.date) < lastAdminShareDate;
};

const addNonAdminResponse = (response: TseRespondType, translations: AnyRecord, req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.responseFrom, translations[response.from]),
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.date, req.url)),
    addSummaryRow(translations.responseText, response.response || DefaultValues.STRING_DASH)
  );

  if (response.supportingMaterial) {
    const docType = getDocumentFromDocumentTypeItems(response.supportingMaterial);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  if (response.copyToOtherParty) {
    rows.push(addSummaryRow(translations.copyCorrespondence, translations[response.copyToOtherParty]));
  }

  return rows;
};

const addAdminResponse = (response: TseRespondType, translations: AnyRecord, req: AppRequest): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  if (response.enterResponseTitle) {
    rows.push(addSummaryRow(translations.responseItem, response.enterResponseTitle));
  }

  rows.push(
    addSummaryRow(translations.date, datesStringToDateInLocale(response.date, req.url)),
    addSummaryRow(translations.sentBy, translations.tribunal),
    addSummaryRow(translations.orderOrRequest, translations[response.isCmoOrRequest])
  );

  if (response.isResponseRequired) {
    rows.push(addSummaryRow(translations.responseDue, translations[response.isResponseRequired]));
  }

  if (response.selectPartyRespond) {
    rows.push(addSummaryRow(translations.partyToRespond, translations[response.selectPartyRespond]));
  }

  if (response.additionalInformation) {
    rows.push(addSummaryRow(translations.additionalInfo, response.additionalInformation));
  }

  if (response.addDocument && ObjectUtils.isNotEmpty(response.addDocument)) {
    const docType = getDocumentFromDocumentTypeItems(response.addDocument);
    const link = getLinkFromDocument(docType.uploadedDocument);
    rows.push(
      addSummaryRow(translations.description, docType.shortDescription),
      addSummaryHtmlRow(translations.document, link)
    );
  }

  if (response.requestMadeBy) {
    rows.push(addSummaryRow(translations.requestMadeBy, translations[response.requestMadeBy]));
  } else if (response.cmoMadeBy) {
    rows.push(addSummaryRow(translations.requestMadeBy, translations[response.cmoMadeBy]));
  }

  if (response.madeByFullName) {
    rows.push(addSummaryRow(translations.name, response.madeByFullName));
  }

  rows.push(addSummaryRow(translations.sentTo, translations[response.selectPartyNotify]));

  return rows;
};

/**
 * Get selected application decision
 * @param app selected application
 * @param req request
 */
export const getDecisionContent = (app: GenericTseApplicationTypeItem, req: AppRequest): SummaryListRow[][] => {
  const selectedAppAdminDecision = app.value?.adminDecision?.filter(d => isDecisionShareToRespondent(d.value));
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
 * @param user user in request
 */
export const isResponseToTribunalRequired = (app: GenericTseApplicationType, user: UserDetails): boolean => {
  if (!app || ObjectUtils.isEmpty(app.respondCollection) || !user) {
    return false;
  }

  const lastAdminRequireDate = getLatestDateFromResponses(
    app.respondCollection.filter(
      response =>
        response.value.from === Applicant.ADMIN &&
        (response.value.selectPartyRespond === Parties.BOTH_PARTIES ||
          response.value.selectPartyRespond === Parties.RESPONDENT_ONLY)
    )
  );

  if (!lastAdminRequireDate) {
    return false;
  }

  const lastUserRespondDate = getLatestDateFromResponses(
    app.respondCollection.filter(
      response =>
        response.value.from === Applicant.RESPONDENT &&
        response.value.fromIdamId &&
        response.value.fromIdamId === user.id
    )
  );

  if (!lastUserRespondDate) {
    return true;
  }

  return lastAdminRequireDate > lastUserRespondDate;
};

const getLatestDateFromResponses = (responses: TseRespondTypeItem[]): Date => {
  return (
    responses.map(response => new Date(response.value.date!)).sort((a, b) => b.getTime() - a.getTime())[0] || undefined
  );
};
