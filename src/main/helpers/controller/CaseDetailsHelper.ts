import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../definitions/links';
import { getCaseApi } from '../../services/CaseService';
import { getApplicationStateIfNotExist } from '../ApplicationStateHelper';

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
  const apps = req.session?.userCase?.genericTseApplicationCollection;
  await updateApplicationsStatusIfNotExist(apps, req);
  updateYourRequestsAndApplications(statuses, apps, req.session.user);
  updateClaimantAppsLinkStatus(statuses, apps, req.session.user);
  updateOtherRespondentAppsLinkStatus(statuses, apps, req.session.user);
  return statuses;
};

const updateApplicationsStatusIfNotExist = async (
  allApps: GenericTseApplicationTypeItem[],
  req: AppRequest
): Promise<void> => {
  const user = req.session?.user;
  const filteredApps =
    allApps?.filter(app => !app.value?.respondentState?.some(state => state.value?.userIdamId === user?.id)) || [];
  for (const app of filteredApps) {
    const newState: LinkStatus = getApplicationStateIfNotExist(app.value, req.session.user);
    await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req, app, newState);
  }
};

const updateYourRequestsAndApplications = (
  statuses: ET3CaseDetailsLinksStatuses,
  allApps: GenericTseApplicationTypeItem[],
  user: UserDetails
): void => {
  const apps = allApps?.filter(app => isYourApplication(app.value, user)) || [];
  statuses[ET3CaseDetailsLinkNames.YourRequestsAndApplications] = getLinkStatus(apps, user, true);
};

const updateClaimantAppsLinkStatus = (
  statuses: ET3CaseDetailsLinksStatuses,
  allApps: GenericTseApplicationTypeItem[],
  user: UserDetails
): void => {
  const apps = allApps?.filter(app => isClaimantApplicationShare(app.value)) || [];
  statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = getLinkStatus(apps, user, false);
};

const updateOtherRespondentAppsLinkStatus = (
  statuses: ET3CaseDetailsLinksStatuses,
  allApps: GenericTseApplicationTypeItem[],
  user: UserDetails
): void => {
  const apps = allApps?.filter(app => isOtherRespApplicationShare(app.value, user)) || [];
  statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = getLinkStatus(apps, user, false);
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
