import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { ApplicationNotification } from '../../definitions/notification/applicationNotification';
import { AnyRecord } from '../../definitions/util-types';
import { getApplicationDisplay, isApplicantClaimant, isApplicantRespondent } from '../GenericTseApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { isResponseToTribunalRequired } from '../controller/ApplicationDetailsHelper';
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
      appNotifications.push({
        appName: getApplicationDisplay(app.value, translations),
        from: getFrom(app.value, req.session.user, translations),
        appUrl: PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam,
      });
    }
  }

  return appNotifications;
};

const getFrom = (app: GenericTseApplicationType, user: UserDetails, translations: AnyRecord) => {
  if (isApplicantClaimant(app)) {
    return translations.theClaimant;
  } else if (isApplicantRespondent(app)) {
    if (isYourApplication(app, user)) {
      return translations.your;
    } else {
      return translations.theRespondent;
    }
  }
  return '';
};
