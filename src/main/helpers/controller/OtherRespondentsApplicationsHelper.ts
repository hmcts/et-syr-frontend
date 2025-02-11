import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';

import { isApplicationShare } from './ClaimantsApplicationsHelper';
import { updateAppsDisplayInfo } from './YourRequestAndApplicationsHelper';

/**
 * Get other respondent's applications
 * @param req request
 */
export const getOtherRespondentsApplications = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const otherRespApps = (req.session.userCase.genericTseApplicationCollection || []).filter(app =>
    isOtherRespApplicationShare(app)
  );
  return updateAppsDisplayInfo(otherRespApps, req);
};

/**
 * Check if other respondent's application is shared to user
 * @param app selected application
 */
export const isOtherRespApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value?.applicant !== Applicant.RESPONDENT) {
    return false;
  }
  return isApplicationShare(app);
};
