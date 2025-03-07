import { AppRequest } from '../../definitions/appRequest';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../definitions/links';

import { isClaimantApplicationShare } from './ClaimantsApplicationsHelper';
import { isOtherRespApplicationShare } from './OtherRespondentsApplicationsHelper';

export const getET3CaseDetailsLinkNames = (
  statuses: ET3CaseDetailsLinksStatuses,
  req: AppRequest
): ET3CaseDetailsLinksStatuses => {
  const apps = req.session?.userCase?.genericTseApplicationCollection;

  if (!(ET3CaseDetailsLinkNames.OtherRespondentApplications in statuses)) {
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = LinkStatus.NOT_YET_AVAILABLE;
  }

  if (
    statuses[ET3CaseDetailsLinkNames.ClaimantApplications] === LinkStatus.NOT_YET_AVAILABLE &&
    apps?.some(app => isClaimantApplicationShare(app.value))
  ) {
    statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = LinkStatus.IN_PROGRESS;
  }

  if (
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] === LinkStatus.NOT_YET_AVAILABLE &&
    apps?.some(app => isOtherRespApplicationShare(app.value, req.session.user))
  ) {
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = LinkStatus.IN_PROGRESS;
  }

  return statuses;
};
