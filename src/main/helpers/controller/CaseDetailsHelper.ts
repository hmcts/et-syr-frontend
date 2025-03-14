import { AppRequest } from '../../definitions/appRequest';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../definitions/links';
import { getLogger } from '../../logger';
import ET3Util from '../../utils/ET3Util';

import { isClaimantApplicationShare } from './ClaimantsApplicationsHelper';
import { isOtherRespApplicationShare } from './OtherRespondentsApplicationsHelper';

const logger = getLogger('CaseDetailsController');

export const getET3CaseDetailsLinkNames = async (
  statuses: ET3CaseDetailsLinksStatuses,
  req: AppRequest
): Promise<ET3CaseDetailsLinksStatuses> => {
  const apps = req.session?.userCase?.genericTseApplicationCollection;

  if (!(ET3CaseDetailsLinkNames.OtherRespondentApplications in statuses)) {
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = LinkStatus.NOT_YET_AVAILABLE;
  }

  if (
    statuses[ET3CaseDetailsLinkNames.ClaimantApplications] === LinkStatus.NOT_YET_AVAILABLE &&
    apps?.some(app => isClaimantApplicationShare(app.value))
  ) {
    logger.info('Update ET3CaseDetailsLinkNames.ClaimantApplications');
    statuses[ET3CaseDetailsLinkNames.ClaimantApplications] = LinkStatus.IN_PROGRESS;
    await ET3Util.updateCaseDetailsLinkStatuses(
      req,
      ET3CaseDetailsLinkNames.ClaimantApplications,
      LinkStatus.IN_PROGRESS
    );
  }

  if (
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] === LinkStatus.NOT_YET_AVAILABLE &&
    apps?.some(app => isOtherRespApplicationShare(app.value, req.session.user))
  ) {
    logger.info('Update ET3CaseDetailsLinkNames.OtherRespondentApplications');
    statuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = LinkStatus.IN_PROGRESS;
    await ET3Util.updateCaseDetailsLinkStatuses(
      req,
      ET3CaseDetailsLinkNames.OtherRespondentApplications,
      LinkStatus.IN_PROGRESS
    );
  }

  return statuses;
};
