import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import { getLanguageParam } from '../RouterHelpers';

import { getApplicationDisplayByClaimantCode, getApplicationDisplayByCode } from './ContactTribunalHelper';

/**
 * Update applications' display info
 * @param apps application list
 * @param req request
 */
export const updateAppsDisplayInfo = (
  apps: GenericTseApplicationTypeItem[],
  req: AppRequest
): GenericTseApplicationTypeItem[] => {
  if (ObjectUtils.isEmpty(apps)) {
    return [];
  }
  const url = req.url;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  apps.forEach(app => {
    app.linkValue = getApplicationDisplay(app, translations);
    app.redirectUrl = PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(url);
    app.statusColor = linkStatusColorMap.get(<LinkStatus>app.value.applicationState);
    app.displayStatus = translations[app.value.applicationState];
  });
  return apps;
};

const getApplicationDisplay = (app: GenericTseApplicationTypeItem, translations: AnyRecord): string => {
  return app.value?.applicant === Applicant.RESPONDENT
    ? getApplicationDisplayByCode(app.value.type, translations)
    : getApplicationDisplayByClaimantCode(app.value.type, translations);
};

/**
 * Get user's applications
 * @param req request
 */
export const getApplicationCollection = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const yourApps = (req.session.userCase?.genericTseApplicationCollection || []).filter(app => isYourApplication(app));
  return updateAppsDisplayInfo(yourApps, req);
};

/**
 * Check if application is created by current user
 * @param app selected application
 */
export const isYourApplication = (app: GenericTseApplicationTypeItem): boolean => {
  // TODO: update this placeholder
  return app.value?.applicant === Applicant.RESPONDENT;
};
