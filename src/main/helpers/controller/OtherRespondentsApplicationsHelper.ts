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
    isOtherRespApplicationShare(app, req)
  );
  return updateAppsDisplayInfo(otherRespApps, req);
};

const isOtherRespApplicationShare = (app: GenericTseApplicationTypeItem, req: AppRequest): boolean => {
  return (
    app.value?.applicant === Applicant.RESPONDENT &&
    app.value?.applicantIdamId !== req.session.user.id &&
    isApplicationShare(app)
  );
};
