import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  TseAdminDecision,
  TseRespondType,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, IsCmoOrRequest, PartiesNotify, PartiesRespond, TranslationKeys } from '../../definitions/constants';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { LinkStatus } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import CollectionUtils from '../../utils/CollectionUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import { getApplicationState } from '../ApplicationStateHelper';
import { getDocumentFromDocumentTypeItems, getLinkFromDocument } from '../DocumentHelpers';
import { getApplicationDisplay } from '../GenericTseApplicationHelper';
import { datesStringToDateInLocale } from '../dateInLocale';

import { isAdminResponseShareToRespondent, isDecisionShareToRespondent } from './ClaimantsApplicationsHelper';

/**
 * Display details of selected application.
 * @param app selected application
 * @param req request
 */
export const getApplicationContent = (app: GenericTseApplicationType, req: AppRequest): SummaryListRow[] => {
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };
  const applicationDate = datesStringToDateInLocale(app.date, req.url);

  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(translations.applicant, translations[app.applicant]),
    addSummaryRow(translations.requestDate, applicationDate),
    addSummaryRow(translations.applicationType, getApplicationDisplay(app, translations))
  );

  if (app.details) {
    rows.push(addSummaryRow(translations.legend, app.details));
  }

  if (app.documentUpload) {
    const link = getLinkFromDocument(app.documentUpload);
    rows.push(addSummaryHtmlRow(translations.supportingMaterial, link));
  }

  rows.push(addSummaryRow(translations.copyCorrespondence, translations[app.copyToOtherPartyYesOrNo]));

  if (app.copyToOtherPartyText) {
    rows.push(addSummaryRow(translations.copyToOtherPartyText, app.copyToOtherPartyText));
  }

  return rows;
};

/**
 * Get all responses in respondCollection
 * @param app selected GenericTseApplicationTypeItem
 * @param req request
 */
export const getAllResponses = (app: GenericTseApplicationType, req: AppRequest): SummaryListRow[][] => {
  if (!app || ObjectUtils.isEmpty(app.respondCollection)) {
    return [];
  }

  const allResponses: SummaryListRow[][] = [];

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
  };

  const lastAdminShareDate = getLastAdminShareDate(app.respondCollection);
  for (const r of app.respondCollection) {
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
  return getLatestDateFromResponses(
    responses.filter(
      item =>
        item.value?.from === Applicant.ADMIN &&
        (item.value?.selectPartyNotify === PartiesNotify.BOTH_PARTIES ||
          item.value?.selectPartyNotify === PartiesNotify.RESPONDENT_ONLY) &&
        item.value?.date
    )
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
    addSummaryRow(translations.responseDate, datesStringToDateInLocale(response.date, req.url))
  );

  if (response.response) {
    rows.push(addSummaryRow(translations.responseText, response.response));
  }

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

  if (
    response.isCmoOrRequest === IsCmoOrRequest.CASE_MANAGEMENT_ORDER ||
    response.isCmoOrRequest === IsCmoOrRequest.REQUEST
  ) {
    rows.push(addSummaryRow(translations.responseDue, translations[response.isResponseRequired]));

    if (response.isResponseRequired === YesOrNo.YES) {
      rows.push(addSummaryRow(translations.partyToRespond, translations[response.selectPartyRespond]));
    }
  }

  if (response.additionalInformation) {
    rows.push(addSummaryRow(translations.additionalInfo, response.additionalInformation));
  }

  if (response.addDocument && ObjectUtils.isNotEmpty(response.addDocument)) {
    const docType = getDocumentFromDocumentTypeItems(response.addDocument);
    const link = getLinkFromDocument(docType.uploadedDocument);
    if (docType.shortDescription) {
      rows.push(addSummaryRow(translations.description, docType.shortDescription));
    }
    rows.push(addSummaryHtmlRow(translations.document, link));
  }

  if (
    response.isCmoOrRequest === IsCmoOrRequest.CASE_MANAGEMENT_ORDER ||
    response.isCmoOrRequest === IsCmoOrRequest.REQUEST
  ) {
    if (response.requestMadeBy) {
      rows.push(addSummaryRow(translations.requestMadeBy, translations[response.requestMadeBy]));
    } else if (response.cmoMadeBy) {
      rows.push(addSummaryRow(translations.requestMadeBy, translations[response.cmoMadeBy]));
    }

    if (response.madeByFullName) {
      rows.push(addSummaryRow(translations.name, response.madeByFullName));
    }
  }

  rows.push(addSummaryRow(translations.sentTo, translations[response.selectPartyNotify]));

  return rows;
};

/**
 * Get selected application decision
 * @param app selected application
 * @param req request
 */
export const getDecisionContent = (app: GenericTseApplicationType, req: AppRequest): SummaryListRow[][] => {
  if (!app) {
    return [];
  }

  const selectedAppAdminDecision = app.adminDecision?.filter(d => isDecisionShareToRespondent(d.value));
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
        (response.value.selectPartyRespond === PartiesRespond.BOTH_PARTIES ||
          response.value.selectPartyRespond === PartiesRespond.RESPONDENT)
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
  const dates = responses.map(response => {
    const dateToCompare = response.value.dateTime || response.value.date;
    return new Date(dateToCompare!);
  });
  return dates.sort((a, b) => b.getTime() - a.getTime())[0] || undefined;
};

/**
 * Get new application state after viewed
 * @param app application
 * @param user current user
 */
export const getApplicationStatusAfterViewed = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  const currentState = getApplicationState(app, user);
  if (currentState === LinkStatus.NOT_VIEWED) {
    return LinkStatus.VIEWED;
  } else if (currentState === LinkStatus.UPDATED) {
    return LinkStatus.IN_PROGRESS;
  } else if (currentState === LinkStatus.NOT_STARTED_YET && isResponseToTribunalRequired(app, user)) {
    return LinkStatus.IN_PROGRESS;
  }
  return undefined;
};
