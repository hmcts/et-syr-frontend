import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { TseRequestNotification } from '../../definitions/notification/tseRequestNotification';
import { TseSubmitNotification } from '../../definitions/notification/tseSubmitNotification';
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
export const getAppRequestNotification = (
  apps: GenericTseApplicationTypeItem[],
  req: AppRequest
): TseRequestNotification[] => {
  const items: TseRequestNotification[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  for (const app of apps || []) {
    if (isResponseToTribunalRequired(app.value, req.session.user)) {
      items.push({
        from: getFrom(app.value, req.session.user, translations),
        appName: getApplicationDisplay(app.value, translations).toLowerCase(),
        appUrl: getAppUrl(app, languageParam),
      });
    }
  }

  return items;
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

const getAppUrl = (app: GenericTseApplicationTypeItem, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam;
};

/**
 * Get notification banner for applications which other party submitted
 * @param apps
 * @param req
 */
export const getAppNotificationFromSubmit = (
  apps: GenericTseApplicationTypeItem[],
  req: AppRequest
): TseSubmitNotification[] => {
  const items: TseSubmitNotification[] = [];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);

  for (const app of apps || []) {
    if (
      isNeverResponseBefore(app.value, req.session.user) &&
      !isResponseToTribunalRequired(app.value, req.session.user)
    ) {
      items.push({
        from: translations.notificationBanner.tseHasSubmit[app.value.applicant].toLowerCase(),
        appName: getApplicationDisplay(app.value, translations).toLowerCase(),
        appType: getAppType(app.value),
        dueDate: new Date(Date.parse(app.value.dueDate)),
        appUrl: getAppUrl(app, languageParam),
      });
    }
  }

  return items;
};
