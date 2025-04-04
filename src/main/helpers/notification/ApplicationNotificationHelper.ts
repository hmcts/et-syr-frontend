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
import { isApplicationShare } from '../controller/ClaimantsApplicationsHelper';
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

  const filterApps = apps.filter(
    app => isYourApplication(app.value, req.session.user) || isApplicationShare(app.value)
  );

  for (const app of filterApps) {
    if (isResponseToTribunalRequired(app.value, req.session.user)) {
      requestNotifications.push(getRequestItems(app, req.session.user, translations, languageParam));
    } else if (isNeverResponseBefore(app.value, req.session.user)) {
      submitNotifications.push(getSubmitItems(app, translations, languageParam, req.session.userCase?.respondents));
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
  languageParam: string,
  respondents: RespondentET3Model[]
): TseSubmitNotification => {
  return {
    from: translations.notificationBanner.tseHasSubmit[app.value.applicant].toLowerCase(),
    fromName: getFromName(app.value, respondents),
    appName: getApplicationDisplay(app.value, translations).toLowerCase(),
    isTypeB: getAppType(app.value) === ApplicationType.B,
    dueDate: new Date(Date.parse(app.value.dueDate)),
    appUrl: PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + languageParam,
  };
};

const getFromName = (app: GenericTseApplicationType, respondents: RespondentET3Model[]): string => {
  if (app?.applicantIdamId && app?.applicant === Applicant.RESPONDENT) {
    return respondents.find(r => r.idamId === app.applicantIdamId)?.respondentName || '';
  }
  return '';
};
