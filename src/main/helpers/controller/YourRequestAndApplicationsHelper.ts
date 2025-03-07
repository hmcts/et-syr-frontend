import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { ApplicationList } from '../../definitions/applicationList';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import { getApplicationState } from '../ApplicationStateHelper';
import { getApplicationDisplay } from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Update applications' display info
 * @param apps application list
 * @param req request
 */
export const updateAppsDisplayInfo = (apps: GenericTseApplicationTypeItem[], req: AppRequest): ApplicationList[] => {
  if (ObjectUtils.isEmpty(apps)) {
    return [];
  }
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  return apps.map(app => {
    const appState: LinkStatus = getApplicationState(app.value, req.session.user);
    return {
      submitDate: app.value.date,
      redirectUrl: PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(req.url),
      linkValue: getApplicationDisplay(app.value, translations),
      displayStatus: translations[appState],
      statusColor: linkStatusColorMap.get(appState),
      lastUpdatedDate: findLatestUpdateDate(app.value),
    };
  });
};

const findLatestUpdateDate = (application: GenericTseApplicationType): Date => {
  const dates: Date[] = [
    application.date ? new Date(application.date) : null,
    ...(
      application.respondCollection?.flatMap(respond =>
        [respond.value?.date, respond.value?.dateTime].filter(date => date)
      ) ?? []
    ).map(date => new Date(date)),
    ...(application.adminDecision?.flatMap(decision => (decision.value?.date ? [new Date(decision.value.date)] : [])) ??
      []),
  ].filter((date): date is Date => date instanceof Date);

  return dates.length > 0 ? new Date(Math.max(...dates.map(date => date.getTime()))) : undefined;
};

/**
 * Get user's applications
 * @param req request
 */
export const getYourApplicationCollection = (req: AppRequest): ApplicationList[] => {
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
  return app?.applicant === Applicant.RESPONDENT && app?.applicantIdamId === user?.id;
};
