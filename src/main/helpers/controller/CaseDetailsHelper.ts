import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { CaseWithId, RespondentET3Model, YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Et3ResponseStatus, TranslationKeys } from '../../definitions/constants';
import {
  ET3CaseDetailsLinkNames,
  ET3CaseDetailsLinksStatuses,
  LinkStatus,
  getResponseCaseDetailsLinkStatusesByRespondentCaseDetailsLinkStatuses,
  linkStatusColorMap,
} from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getCaseApi } from '../../services/CaseService';
import StringUtils from '../../utils/StringUtils';
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
  statuses[ET3CaseDetailsLinkNames.RespondentResponse] = getRespondentResponseLinkStatus(
    req.session.userCase,
    statuses[ET3CaseDetailsLinkNames.RespondentResponse]
  );
  statuses[ET3CaseDetailsLinkNames.HearingDetails] = getHearingDetailsLinkStatus(req.session.userCase);
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

const getHearingDetailsLinkStatus = (userCase: CaseWithId): LinkStatus => {
  return userCase.hearingCollection?.length > 0 ? LinkStatus.READY_TO_VIEW : LinkStatus.NOT_YET_AVAILABLE;
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

interface SectionItem {
  title: {
    text: string;
  };
  href?: string;
  status: {
    text?: string;
    tag?: {
      text: string;
      classes: string;
    };
  };
}

interface Section {
  title: string;
  items: SectionItem[];
}

function getSectionItems(
  translations: AnyRecord,
  linkName: ET3CaseDetailsLinkNames,
  status: LinkStatus,
  eT3CaseDetailsLinksUrlMap: Map<string, string>
): SectionItem {
  const shouldLinkClickable: boolean = shouldCaseDetailsLinkBeClickable(status);
  const title = {
    text: translations[linkName],
  };
  const tag = {
    text: translations[status],
    classes: 'govuk-tag' + linkStatusColorMap.get(status),
  };
  return shouldLinkClickable
    ? {
        title,
        href: eT3CaseDetailsLinksUrlMap.get(linkName),
        status: { tag },
      }
    : {
        title,
        status: { tag },
      };
}

function getSection(
  SectionIndex: ET3CaseDetailsLinkNames[][],
  translations: AnyRecord,
  index: number,
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  eT3CaseDetailsLinksUrlMap: Map<string, string>
): Section {
  return {
    title: translations[`section${index + 1}`],
    items: SectionIndex[index].map(linkName => {
      const status = et3CaseDetailsLinksStatuses[linkName];
      return getSectionItems(translations, linkName, status, eT3CaseDetailsLinksUrlMap);
    }),
  };
}

export function getSections(
  SectionIndex: ET3CaseDetailsLinkNames[][],
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
  const eT3CaseDetailsLinksUrlMap = getET3CaseDetailsLinksUrlMap(languageParam, selectedRespondent);
  return Array.from(Array(SectionIndex.length)).map((__ignored, index) => {
    return getSection(SectionIndex, translations, index, et3CaseDetailsLinksStatuses, eT3CaseDetailsLinksUrlMap);
  });
}

export const getRespondentName = (selectedRespondent: RespondentET3Model): string => {
  if (StringUtils.isNotBlank(selectedRespondent.respondentName)) {
    return selectedRespondent.respondentName;
  }
  if (StringUtils.isNotBlank(selectedRespondent.respondentOrganisation)) {
    return selectedRespondent.respondentOrganisation;
  }
  return selectedRespondent.respondentFirstName + ' ' + selectedRespondent.respondentLastName;
};
