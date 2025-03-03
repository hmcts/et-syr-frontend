import { AppRequest, UserDetails } from '../../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { ApplicationNotification } from '../../definitions/notification/applicationNotification';
import { AnyRecord } from '../../definitions/util-types';
import { getApplicationDisplay } from '../ApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';
import { isResponseToTribunalRequired } from '../controller/ApplicationDetailsHelper';

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
  if (app.applicant === Applicant.CLAIMANT) {
    return translations.theClaimant;
  } else if (app.applicant === Applicant.RESPONDENT) {
    if (app.applicantIdamId || app.applicantIdamId === user.id) {
      return translations.your;
    } else {
      return translations.theRespondent;
    }
  }
  return '';
};
