import { AppRequest, UserDetails } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls } from '../definitions/constants';
import { RespondentTse } from '../definitions/respondentTse';

import { getApplicationByCode } from './ApplicationHelper';
import { isYourApplication } from './controller/YourRequestAndApplicationsHelper';

/**
 * Get selected stored application by id
 * @param req request
 */
export const getSelectedStoredApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  return getYourStoredApplicationList(req)?.find(it => it.id === req.params.appId);
};

/**
 * Get user's stored applications
 * @param req request
 */
export const getYourStoredApplicationList = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  return req.session.userCase.tseRespondentStoredCollection?.filter(app =>
    isYourApplication(app.value, req.session.user)
  );
};

/**
 * Map stored application to respondentTse
 * @param user
 * @param app
 */
export const getRespondentTse = (user: UserDetails, app: GenericTseApplicationTypeItem): RespondentTse => {
  const appType = getApplicationByCode(app.value.type);
  return {
    respondentIdamId: user.id,
    contactApplicationType: app.value.type,
    contactApplicationClaimantType: appType ? appType.claimant : null,
    contactApplicationText: app.value.details,
    contactApplicationFile: app.value.documentUpload,
    copyToOtherPartyYesOrNo: app.value.copyToOtherPartyYesOrNo,
    storedApplicationId: app.id,
  };
};

/**
 * Get submit stored application link
 * @param appId application id
 * @param languageParam language parameter
 */
export const getSubmitStoredAppLink = (appId: string, languageParam: string): string => {
  return PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', appId) + languageParam;
};
