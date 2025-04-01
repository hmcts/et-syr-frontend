import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { ApplicationNotification } from '../../definitions/notification/applicationNotification';
import { AnyRecord } from '../../definitions/util-types';
import {
  getApplicationDisplay,
  isApplicantClaimant,
  isApplicantRespondent,
  isResponseToTribunalRequired,
} from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { isNeverResponseBefore } from '../controller/ApplicationDetailsHelper';
import { isYourApplication } from '../controller/YourRequestAndApplicationsHelper';

export const getAppNotificationFromAdmin = (
  apps: GenericTseApplicationTypeItem[],
  req: AppRequest
): ApplicationNotification[] => {
  const appNotifications: ApplicationNotification[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);
  for (const app of apps || []) {
    if (isResponseToTribunalRequired(app.value, req.session.user)) {
      appNotifications.push(getFromAdminDetails(translations, app, req.session.user, languageParam));
    } else if (isNeverResponseBefore(app.value, req.session.user)) {
      appNotifications.push(getAppSubmitDetails(translations, app, req.session.user, languageParam));
    }
  }

  return appNotifications;
};

const getFromAdminDetails = (
  translations: AnyRecord,
  app: GenericTseApplicationTypeItem,
  user: UserDetails,
  languageParam: string
): ApplicationNotification => {
  const text =
    translations.notificationBanner.tseFromTribunal.p1 +
    getFromForAdmin(app.value, user, translations) +
    translations.notificationBanner.tseFromTribunal.p2 +
    getApplicationDisplay(app.value, translations);
  const appUrl = getAppUrl(app, languageParam);
  return { text, appUrl };
};

const getFromForAdmin = (app: GenericTseApplicationType, user: UserDetails, translations: AnyRecord): string => {
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

const getAppSubmitDetails = (
  translations: AnyRecord,
  app: GenericTseApplicationTypeItem,
  user: UserDetails,
  languageParam: string
): ApplicationNotification => {
  const text =
    translations.notificationBanner.tseHasSubmit.p1 +
    translations.notificationBanner.tseHasSubmit[app?.value?.applicant] +
    translations.notificationBanner.tseHasSubmit.p2;
  const appUrl = getAppUrl(app, languageParam);
  return { text, appUrl };
};

const getAppUrl = (app: GenericTseApplicationTypeItem, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam;
};
