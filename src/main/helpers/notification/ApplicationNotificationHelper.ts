import { AppRequest, UserDetails } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { ApplicationType } from '../../definitions/contact-tribunal-applications';
import {
  TseNotification,
  TseRequestNotification,
  TseSubmitNotification,
} from '../../definitions/notification/tseNotification';
import { TseStoreNotification } from '../../definitions/notification/tseStoreNotification';
import { AnyRecord } from '../../definitions/util-types';
import {
  getAppType,
  getApplicationDisplay,
  isApplicantClaimant,
  isApplicantRespondent,
  isResponseToTribunalRequired,
} from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { getYourStoredApplicationList } from '../StoredApplicationHelper';
import { isNeverResponseBefore } from '../controller/ApplicationDetailsHelper';
import { isApplicationShare } from '../controller/ClaimantsApplicationsHelper';
import { isYourApplication } from '../controller/YourRequestAndApplicationsHelper';

/**
 * Get notification banner for applications which Tribunal requested response
 * @param apps
 * @param req
 */
export const getAppNotifications = (apps: GenericTseApplicationTypeItem[], req: AppRequest): TseNotification => {
  const requestNotifications: TseRequestNotification[] = [];
  const submitNotifications: TseSubmitNotification[] = [];

  const user = req.session.user;
  const respondents = req.session.userCase?.respondents ?? [];
  const languageParam = getLanguageParam(req.url);

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };

  const visibleApps = apps?.filter(app => isYourApplication(app.value, user) || isApplicationShare(app.value));

  for (const app of visibleApps || []) {
    if (isResponseToTribunalRequired(app.value, user)) {
      requestNotifications.push(getRequestItems(app, user, translations, languageParam));
    } else if (isNeverResponseBefore(app.value, user)) {
      submitNotifications.push(getSubmitItems(app, translations, languageParam, respondents));
    }
  }

  return { appRequestNotifications: requestNotifications, appSubmitNotifications: submitNotifications };
};

const getRequestItems = (
  app: GenericTseApplicationTypeItem,
  user: UserDetails,
  translations: AnyRecord,
  languageParam: string
): TseRequestNotification => {
  return {
    from: getFromLabel(app.value, user, translations),
    appName: getApplicationDisplay(app.value, translations).toLowerCase(),
    appUrl: getAppUrl(app, languageParam),
  };
};

const getSubmitItems = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string,
  respondents: RespondentET3Model[]
): TseSubmitNotification => {
  return {
    from: translations.notificationBanner.tseHasSubmit[app.value.applicant].toLowerCase(),
    fromName: getFromName(app.value, respondents),
    appName: getApplicationDisplay(app.value, translations).toLowerCase(),
    isTypeB: getAppType(app.value) === ApplicationType.B,
    dueDate: new Date(Date.parse(app.value.dueDate)),
    appUrl: getAppUrl(app, languageParam),
  };
};

const getFromLabel = (app: GenericTseApplicationType, user: UserDetails, translations: AnyRecord): string => {
  if (isApplicantClaimant(app)) {
    return translations.notificationBanner.tseFromTribunal.theClaimant;
  }
  if (isYourApplication(app, user)) {
    return translations.notificationBanner.tseFromTribunal.your;
  }
  if (isApplicantRespondent(app)) {
    return translations.notificationBanner.tseFromTribunal.theRespondent;
  }
  return '';
};

const getFromName = (app: GenericTseApplicationType, respondents: RespondentET3Model[]): string => {
  if (app?.applicant === Applicant.RESPONDENT && app?.applicantIdamId) {
    return respondents.find(r => r.idamId === app.applicantIdamId)?.respondentName || '';
  }
  return '';
};

const getAppUrl = (app: GenericTseApplicationTypeItem, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam;
};

/**
 * Get notification banner for stored applications
 * @param req request
 */
export const getStoredTseBannerList = (req: AppRequest): TseStoreNotification[] => {
  const notifications: TseStoreNotification[] = [];
  const languageParam = getLanguageParam(req.url);

  const yourStoredApps: GenericTseApplicationTypeItem[] = getYourStoredApplicationList(req);
  notifications.push(...getStoredApplication(yourStoredApps, languageParam));

  return notifications;
};

const getStoredApplication = (apps: GenericTseApplicationTypeItem[], languageParam: string): TseStoreNotification[] => {
  const notifications: TseStoreNotification[] = [];
  for (const app of apps || []) {
    notifications.push({
      viewUrl: PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', app.id) + languageParam,
    });
  }
  return notifications;
};
