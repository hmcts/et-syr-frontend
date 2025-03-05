import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import CollectionUtils from '../../utils/CollectionUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import { getApplicationDisplay } from '../GenericTseApplicationHelper';
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
    updateAppDisplayInfo(app, translations, req);
  });
  return apps;
};

const getApplicationState = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  if (CollectionUtils.isNotEmpty(app.respondentState)) {
    const respondentState = app.respondentState.find(state => state.userIdamId === user.id);
    if (respondentState) {
      return <LinkStatus>respondentState.applicationState;
    }
  }
  return LinkStatus.NOT_YET_AVAILABLE;
};

const updateAppDisplayInfo = (app: GenericTseApplicationTypeItem, translations: AnyRecord, req: AppRequest): void => {
  const appState: LinkStatus = getApplicationState(app.value, req.session.user);
  app.linkValue = getApplicationDisplay(app.value, translations);
  app.redirectUrl = PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(req.url);
  app.statusColor = linkStatusColorMap.get(appState);
  app.displayStatus = translations[appState];
};

/**
 * Get user's applications
 * @param req request
 */
export const getYourApplicationCollection = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const yourApps = (req.session.userCase?.genericTseApplicationCollection || []).filter(app =>
    isYourApplication(app.value, req.session.user)
  );
  return updateAppsDisplayInfo(yourApps, req);
};

/**
 * Check if application applied by current user
 * @param app application
 * @param user user details
 */
export const isYourApplication = (app: GenericTseApplicationType, user: UserDetails): boolean => {
  return app.applicant === Applicant.RESPONDENT && app.applicantIdamId === user.id;
};
