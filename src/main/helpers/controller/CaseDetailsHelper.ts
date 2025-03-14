import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../definitions/links';
import { isApplicationWithUserState } from '../ApplicationStateHelper';
import { isResponseToTribunalRequired } from '../GenericTseApplicationHelper';

import { isClaimantApplicationShare } from './ClaimantsApplicationsHelper';
import { isOtherRespApplicationShare } from './OtherRespondentsApplicationsHelper';
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
  const apps = req.session?.userCase?.genericTseApplicationCollection;
  statuses[ET3CaseDetailsLinkNames.YourRequestsAndApplications] = getYourRequestsAndApplications(
    apps,
    req.session.user
  );
  statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = updateClaimantAppsLinkStatus(apps, req.session.user);
  statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = updateOtherRespondentAppsLinkStatus(
    apps,
    req.session.user
  );
  return statuses;
};

const getYourRequestsAndApplications = (allApps: GenericTseApplicationTypeItem[], user: UserDetails): LinkStatus => {
  const apps = allApps?.filter(app => isYourApplication(app.value, user));
  return getLinkStatus(apps, user, true);
};

const updateClaimantAppsLinkStatus = (allApps: GenericTseApplicationTypeItem[], user: UserDetails): LinkStatus => {
  const apps = allApps?.filter(app => isClaimantApplicationShare(app.value));
  return getLinkStatus(apps, user, false);
};

const updateOtherRespondentAppsLinkStatus = (
  allApps: GenericTseApplicationTypeItem[],
  user: UserDetails
): LinkStatus => {
  const apps = allApps?.filter(app => isOtherRespApplicationShare(app.value, user));
  return getLinkStatus(apps, user, false);
};

const getLinkStatus = (apps: GenericTseApplicationTypeItem[], user: UserDetails, isYours: boolean): LinkStatus => {
  if (!apps?.length) {
    return LinkStatus.NOT_YET_AVAILABLE;
  }

  if (apps.some(app => isResponseToTribunalRequired(app.value, user))) {
    return LinkStatus.NOT_STARTED_YET;
  }

  if (getAdminDecisionNotViewed(apps, user)) {
    return LinkStatus.NOT_VIEWED;
  }

  const userApplicationStates = getUserApplicationStates(apps, user);

  if (!userApplicationStates?.length) {
    return isYours ? LinkStatus.IN_PROGRESS : LinkStatus.NOT_STARTED_YET;
  }

  for (const status of priorityOrder) {
    if (userApplicationStates.includes(status)) {
      return status;
    }
  }

  return isYours ? LinkStatus.IN_PROGRESS : LinkStatus.NOT_STARTED_YET;
};

const getAdminDecisionNotViewed = (apps: GenericTseApplicationTypeItem[], user: UserDetails): boolean => {
  return apps.some(app => app.value.adminDecision?.length && !isApplicationWithUserState(app.value, user));
};

const getUserApplicationStates = (apps: GenericTseApplicationTypeItem[], user: UserDetails): string[] => {
  return apps.flatMap(
    app =>
      app.value.respondentState
        ?.filter(state => state.value?.userIdamId === user.id)
        .map(state => state.value.applicationState) || []
  );
};
