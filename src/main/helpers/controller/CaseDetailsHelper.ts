import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../definitions/constants';
import {
  ET3CaseDetailsLinkNames,
  ET3CaseDetailsLinksStatuses,
  LinkStatus,
  SectionIndexToEt3CaseDetailsLinkNames,
  linkStatusColorMap,
} from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getCaseApi } from '../../services/CaseService';
import { getApplicationStateIfNotExist } from '../ApplicationStateHelper';
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
  await updateApplicationsStatusIfNotExist(req);
  statuses[ET3CaseDetailsLinkNames.ClaimantContactDetails] = LinkStatus.READY_TO_VIEW;
  statuses[ET3CaseDetailsLinkNames.YourRequestsAndApplications] = getYourRequestsAndApplications(req);
  statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = getClaimantAppsLinkStatus(req);
  statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = getOtherRespondentAppsLinkStatus(req);
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
  languageParam: string,
  selectedRespondent: RespondentET3Model,
  userCase: CaseWithId
): SectionLink {
  return {
    linkTxt: translations[linkName],
    status: translations[status],
    shouldShow: shouldCaseDetailsLinkBeClickable(status),
    url: getET3CaseDetailsLinksUrlMap(languageParam, selectedRespondent.et3Status, userCase).get(linkName),
    statusColor: linkStatusColorMap.get(status),
  };
}

function getSection(
  translations: AnyRecord,
  index: number,
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  languageParam: string,
  selectedRespondent: RespondentET3Model,
  userCase: CaseWithId
): Section {
  return {
    title: translations[`section${index + 1}`],
    links: SectionIndexToEt3CaseDetailsLinkNames[index].map(linkName => {
      const status = et3CaseDetailsLinksStatuses[linkName];
      return getSectionLink(translations, linkName, status, languageParam, selectedRespondent, userCase);
    }),
  };
}

export function getSections(
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  selectedRespondent: RespondentET3Model,
  req: AppRequest
): Section[] {
  const languageParam = getLanguageParam(req.url);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
  };
  return Array.from(Array(SectionIndexToEt3CaseDetailsLinkNames.length)).map((__ignored, index) => {
    return getSection(
      translations,
      index,
      et3CaseDetailsLinksStatuses,
      languageParam,
      selectedRespondent,
      req.session.userCase
    );
  });
}
