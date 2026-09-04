import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { CaseWithId, RespondentET3Model, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Et3ResponseStatus, TranslationKeys } from '../../definitions/constants';
import {
  ET3CaseDetailsLinkNames,
  ET3CaseDetailsLinksStatuses,
  LinkStatus,
  SectionIndexToEt3CaseDetailsLinkNames,
  getResponseCaseDetailsLinkStatusesByRespondentCaseDetailsLinkStatuses,
  linkStatusColorMap,
} from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getCuiYourSupportFeature } from '../../modules/featureFlag/CuiYourSupportFeature';
import { getCaseApi } from '../../services/CaseService';
import { getApplicationStateIfNotExist } from '../ApplicationStateHelper';
import { getTribunalNotificationLinkStatus } from '../NotificationHelper';
import { getET3CaseDetailsLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../ResponseHubHelper';
import { getLanguageParam } from '../RouterHelpers';
import { getYourStoredApplicationList } from '../StoredApplicationHelper';

import { isClaimantApplicationShare } from './ClaimantsApplicationsHelper';
import { isOtherRespApplicationShare } from './OtherRespondentApplicationsHelper';
import { isYourApplication } from './YourRequestAndApplicationsHelper';

const priorityOrder = [
  LinkStatus.NOT_STARTED_YET,
  LinkStatus.NOT_VIEWED,
  LinkStatus.UPDATED,
  LinkStatus.IN_PROGRESS,
  LinkStatus.VIEWED,
  LinkStatus.WAITING_FOR_TRIBUNAL,
];

export const getET3CaseDetailsLinkNames = async (
  statuses: ET3CaseDetailsLinksStatuses,
  req: AppRequest
): Promise<ET3CaseDetailsLinksStatuses> => {
  // Initialize statuses with defaults if null/undefined, following the pattern from RespondentUtil.java
  statuses = getResponseCaseDetailsLinkStatusesByRespondentCaseDetailsLinkStatuses(statuses);
  await updateApplicationsStatusIfNotExist(req);
  statuses[ET3CaseDetailsLinkNames.ClaimantContactDetails] = LinkStatus.READY_TO_VIEW;
  if (await getCuiYourSupportFeature().isEnabled(req.session.userCase?.caseTypeId)) {
    statuses[ET3CaseDetailsLinkNames.YourSupport] = getYourSupportCaseDetailsLinkStatus(req);
  } else {
    delete statuses[ET3CaseDetailsLinkNames.YourSupport];
  }
  statuses[ET3CaseDetailsLinkNames.RespondentResponse] = getRespondentResponseLinkStatus(
    req.session.userCase,
    statuses[ET3CaseDetailsLinkNames.RespondentResponse]
  );
  statuses[ET3CaseDetailsLinkNames.YourRequestsAndApplications] = getYourRequestsAndApplications(req);
  statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = getClaimantAppsLinkStatus(req);
  statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = getOtherRespondentAppsLinkStatus(req);
  statuses[ET3CaseDetailsLinkNames.TribunalNotification] = getTribunalNotificationLinkStatus(req);
  return statuses;
};

const updateApplicationsStatusIfNotExist = async (req: AppRequest): Promise<void> => {
  const { user, userCase } = req.session;
  const filteredApps =
    userCase?.genericTseApplicationCollection?.filter(
      app => !app.value?.respondentState?.some(state => state.value?.userIdamId === user?.id)
    ) || [];
  for (const app of filteredApps) {
    const newState: LinkStatus = getApplicationStateIfNotExist(app.value, req.session.user);
    await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req, app, newState);
  }
};

const getRespondentResponseLinkStatus = (userCase: CaseWithId, linkName: LinkStatus): LinkStatus => {
  if (userCase?.responseStatus === Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED) {
    return LinkStatus.ACCEPTED;
  }
  return userCase?.responseReceived === YesOrNo.YES ? LinkStatus.SUBMITTED : linkName;
};

const getYourRequestsAndApplications = (req: AppRequest): LinkStatus => {
  if (getYourStoredApplicationList(req)?.length) {
    return LinkStatus.STORED;
  }

  const { user, userCase } = req.session;
  const apps = userCase?.genericTseApplicationCollection?.filter(app => isYourApplication(app.value, user)) || [];
  return getLinkStatus(apps, user, true);
};

const getClaimantAppsLinkStatus = (req: AppRequest): LinkStatus => {
  const { user, userCase } = req.session;
  const apps = userCase?.genericTseApplicationCollection?.filter(app => isClaimantApplicationShare(app.value)) || [];
  return getLinkStatus(apps, user, false);
};

const getOtherRespondentAppsLinkStatus = (req: AppRequest): LinkStatus => {
  const { user, userCase } = req.session;
  const apps =
    userCase?.genericTseApplicationCollection?.filter(app => isOtherRespApplicationShare(app.value, user)) || [];
  return getLinkStatus(apps, user, false);
};

export const getYourSupportLinkStatus = (req: AppRequest): LinkStatus => {
  return req.session?.userCase?.respondentExternalFlags?.details?.length ? LinkStatus.SUBMITTED : LinkStatus.OPTIONAL;
};

export const isEt3ResponseSubmitted = (req: AppRequest): boolean => {
  const userCase = req.session?.userCase;
  const selectedRespondentIndex = req.session?.selectedRespondentIndex;
  const selectedRespondent =
    selectedRespondentIndex === undefined || selectedRespondentIndex === null
      ? undefined
      : userCase?.respondents?.[selectedRespondentIndex];

  return userCase?.responseReceived === YesOrNo.YES || selectedRespondent?.responseReceived === YesOrNo.YES;
};

const getYourSupportCaseDetailsLinkStatus = (req: AppRequest): LinkStatus => {
  return isEt3ResponseSubmitted(req) ? getYourSupportLinkStatus(req) : LinkStatus.NOT_YET_AVAILABLE;
};

const getLinkStatus = (apps: GenericTseApplicationTypeItem[], user: UserDetails, isYours: boolean): LinkStatus => {
  if (!apps?.length) {
    return LinkStatus.NOT_YET_AVAILABLE;
  }

  const userApplicationStates = getUserApplicationStates(apps, user);
  for (const status of priorityOrder) {
    if (userApplicationStates.includes(status)) {
      return status;
    }
  }

  return isYours ? LinkStatus.IN_PROGRESS : LinkStatus.NOT_STARTED_YET;
};

const getUserApplicationStates = (apps: GenericTseApplicationTypeItem[], user: UserDetails): string[] => {
  return (
    apps?.flatMap(
      app =>
        app.value?.respondentState
          ?.filter(state => state.value?.userIdamId === user?.id)
          .map(state => state.value?.applicationState) || []
    ) || []
  );
};

interface SectionLink {
  linkTxt: string;
  status: string;
  shouldShow: boolean;
  url: string;
  statusColor: string;
}

interface Section {
  title: string;
  links: SectionLink[];
}

function getSectionLink(
  translations: AnyRecord,
  linkName: ET3CaseDetailsLinkNames,
  status: LinkStatus,
  eT3CaseDetailsLinksUrlMap: Map<string, string>
): SectionLink {
  return {
    linkTxt: translations[linkName],
    status: translations[status],
    shouldShow: shouldCaseDetailsLinkBeClickable(status),
    url: eT3CaseDetailsLinksUrlMap.get(linkName),
    statusColor: linkStatusColorMap.get(status),
  };
}

function getSection(
  translations: AnyRecord,
  index: number,
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  eT3CaseDetailsLinksUrlMap: Map<string, string>,
  sectionIndexToEt3CaseDetailsLinkNames: ET3CaseDetailsLinkNames[][]
): Section {
  return {
    title: translations[`section${index + 1}`],
    links: sectionIndexToEt3CaseDetailsLinkNames[index].map(linkName => {
      const status = et3CaseDetailsLinksStatuses[linkName];
      return getSectionLink(translations, linkName, status, eT3CaseDetailsLinksUrlMap);
    }),
  };
}

export const getSectionIndexToEt3CaseDetailsLinkNames = async (
  caseTypeId?: string
): Promise<ET3CaseDetailsLinkNames[][]> => {
  const sectionIndexToEt3CaseDetailsLinkNames = SectionIndexToEt3CaseDetailsLinkNames.map(linkNames => [...linkNames]);

  if (await getCuiYourSupportFeature().isEnabled(caseTypeId)) {
    sectionIndexToEt3CaseDetailsLinkNames[0].push(ET3CaseDetailsLinkNames.YourSupport);
  }

  return sectionIndexToEt3CaseDetailsLinkNames;
};

export async function getSections(
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  selectedRespondent: RespondentET3Model,
  req: AppRequest
): Promise<Section[]> {
  const languageParam = getLanguageParam(req.url);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
  };
  const eT3CaseDetailsLinksUrlMap = getET3CaseDetailsLinksUrlMap(languageParam, selectedRespondent);
  const sectionIndexToEt3CaseDetailsLinkNames = await getSectionIndexToEt3CaseDetailsLinkNames(
    req.session.userCase?.caseTypeId
  );
  return Array.from(Array(sectionIndexToEt3CaseDetailsLinkNames.length)).map((__ignored, index) => {
    return getSection(
      translations,
      index,
      et3CaseDetailsLinksStatuses,
      eT3CaseDetailsLinksUrlMap,
      sectionIndexToEt3CaseDetailsLinkNames
    );
  });
}
