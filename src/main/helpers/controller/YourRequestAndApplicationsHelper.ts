import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import { getApplicationDisplay } from '../ApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

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
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  apps.forEach(app => {
    updateAppDisplayInfo(app, translations, req.url);
  });
  return apps;
};

const updateAppDisplayInfo = (app: GenericTseApplicationTypeItem, translations: AnyRecord, url: string): void => {
  // TODO: replace claimant's applicationState to user's application state
  const appState: LinkStatus = <LinkStatus>app.value.applicationState;
  app.linkValue = getApplicationDisplay(app.value, translations);
  app.redirectUrl = PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(url);
  app.statusColor = linkStatusColorMap.get(appState);
  app.displayStatus = translations[appState];
};

/**
 * Get user's applications
 * @param req request
 */
export const getApplicationCollection = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const yourApps = (req.session.userCase?.genericTseApplicationCollection || []).filter(app =>
    isYourApplication(app, req)
  );
  return updateAppsDisplayInfo(yourApps, req);
};

const isYourApplication = (app: GenericTseApplicationTypeItem, req: AppRequest): boolean => {
  return app.value?.applicant === Applicant.RESPONDENT && app.value?.applicantIdamId === req.session.user.id;
};
