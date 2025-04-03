import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import {
  TseNotification,
  TseRequestNotification,
  TseSubmitNotification,
} from '../../definitions/notification/tseNotification';
import { AnyRecord } from '../../definitions/util-types';
import {
  getAppType,
  getApplicationDisplay,
  isApplicantClaimant,
  isApplicantRespondent,
  isResponseToTribunalRequired,
} from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { isNeverResponseBefore } from '../controller/ApplicationDetailsHelper';
import { isYourApplication } from '../controller/YourRequestAndApplicationsHelper';

/**
 * Get notification banner for applications which Tribunal requested response
 * @param apps
 * @param req
 */
export const getAppNotifications = (apps: GenericTseApplicationTypeItem[], req: AppRequest): TseNotification => {
  if (!apps) {
    return { appRequestNotifications: [], appSubmitNotifications: [] };
  }

  const requestNotifications: TseRequestNotification[] = [];
  const submitNotifications: TseSubmitNotification[] = [];

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  for (const app of apps) {
    if (isResponseToTribunalRequired(app.value, req.session.user)) {
      requestNotifications.push(getRequestItems(app, req.session.user, translations, languageParam));
    } else if (isNeverResponseBefore(app.value, req.session.user)) {
      submitNotifications.push(getSubmitItems(app, translations, languageParam));
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
    from: getFrom(app.value, user, translations),
    appName: getApplicationDisplay(app.value, translations).toLowerCase(),
    appUrl: PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam,
  };
};

const getFrom = (app: GenericTseApplicationType, user: UserDetails, translations: AnyRecord): string => {
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

const getSubmitItems = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string
): TseSubmitNotification => {
  return {
    from: translations.notificationBanner.tseHasSubmit[app.value.applicant].toLowerCase(),
    appName: getApplicationDisplay(app.value, translations).toLowerCase(),
    appType: getAppType(app.value),
    dueDate: new Date(Date.parse(app.value.dueDate)),
    appUrl: PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam,
  };
};
