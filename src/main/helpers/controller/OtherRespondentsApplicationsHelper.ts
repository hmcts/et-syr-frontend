import { AppRequest } from '../../definitions/appRequest';
import { ApplicationList } from '../../definitions/applicationList';
import { GenericTseApplicationType } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { isApplicantRespondent } from '../GenericTseApplicationHelper';

import { isApplicationShare } from './ClaimantsApplicationsHelper';
import { updateAppsDisplayInfo } from './YourRequestAndApplicationsHelper';

/**
 * Get other respondent's applications
 * @param req request
 */
export const getOtherRespondentsApplications = (req: AppRequest): ApplicationList[] => {
  const otherRespApps = (req.session.userCase.genericTseApplicationCollection || []).filter(app =>
    isOtherRespApplicationShare(app.value, req)
  );
  return updateAppsDisplayInfo(otherRespApps, req);
};

const isOtherRespApplicationShare = (app: GenericTseApplicationType, req: AppRequest): boolean => {
  return isApplicantRespondent(app) && app.applicantIdamId !== req.session.user.id && isApplicationShare(app);
};
