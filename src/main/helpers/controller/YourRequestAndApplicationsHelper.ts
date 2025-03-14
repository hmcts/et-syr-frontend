import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { ApplicationList } from '../../definitions/applicationList';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseRespondType,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, PartiesNotify, TranslationKeys } from '../../definitions/constants';
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
      lastUpdatedDate: findLatestUpdateDate(app.value, req.session.user),
    };
  });
};

const findLatestUpdateDate = (application: GenericTseApplicationType, user: UserDetails): Date => {
  const applicationDate = application.date ? new Date(application.date) : null;

  const responseDates = application.respondCollection
    ?.filter(respond => isResponseShare(respond.value, user))
    .flatMap(respond => (respond.value?.date ? [new Date(respond.value.date)] : []));

  const adminDecisionDates = application.adminDecision?.flatMap(decision =>
    decision.value?.date ? [new Date(decision.value.date)] : []
  );

  const allDates = [applicationDate, ...(responseDates ?? []), ...(adminDecisionDates ?? [])].filter(
    (date): date is Date => date instanceof Date
  );

  return allDates.length > 0 ? new Date(Math.max(...allDates.map(date => date.getTime()))) : undefined;
};

const isResponseShare = (response: TseRespondType, user: UserDetails): boolean => {
  if (!response) {
    return false;
  }
  if (response.from === Applicant.ADMIN) {
    return (
      response?.selectPartyNotify === PartiesNotify.BOTH_PARTIES ||
      response?.selectPartyNotify === PartiesNotify.RESPONDENT_ONLY
    );
  }
  if (response.fromIdamId === user.id) {
    return true;
  }
  return response.copyToOtherParty === YesOrNo.YES;
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
