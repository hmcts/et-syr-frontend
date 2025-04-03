import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { ApplicationList } from '../../definitions/applicationList';
import { GenericTseApplicationType } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { isApplicantRespondent } from '../GenericTseApplicationHelper';

import { isApplicationShare } from './ClaimantsApplicationsHelper';
import { updateAppsDisplayInfo } from './YourRequestAndApplicationsHelper';

/**
 * Get other respondent applications
 * @param req request
 */
export const getOtherRespondentApplications = (req: AppRequest): ApplicationList[] => {
  const otherRespApps = (req.session.userCase.genericTseApplicationCollection || []).filter(app =>
    isOtherRespApplicationShare(app.value, req.session.user)
  );
  return updateAppsDisplayInfo(otherRespApps, req);
};

/**
 * Check if other respondent's application is shared to other party
 * @param app application
 * @param user user details
 */
export const isOtherRespApplicationShare = (app: GenericTseApplicationType, user: UserDetails): boolean => {
  return isApplicantRespondent(app) && app.applicantIdamId !== user.id && isApplicationShare(app);
};
