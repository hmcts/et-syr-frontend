import { AdminNotification } from '../definitions/adminNotification';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, Parties, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getLanguageParam } from './RouterHelpers';

export const getApplicationRequestFromAdmin = (
  apps: GenericTseApplicationTypeItem[],
  req: AppRequest
): AdminNotification[] => {
  const adminNotifications: AdminNotification[] = [];
  const translations = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
  };
  const languageParam = getLanguageParam(req.url);
  for (const app of apps || []) {
    const adminRequest: AdminNotification[] = getRequestFromAdmin(app, translations, languageParam);
    if (adminRequest.length) {
      adminNotifications.push(adminRequest[adminRequest.length - 1]);
    }
  }
  return adminNotifications;
};

const getRequestFromAdmin = (
  app: GenericTseApplicationTypeItem,
  translations: AnyRecord,
  languageParam: string
): AdminNotification[] => {
  const adminNotifications: AdminNotification[] = [];
  if (!app.value?.respondCollection?.length) {
    return adminNotifications;
  }
  for (const response of app.value.respondCollection) {
    if (isRequestFromAdmin(response, app.value.respondentResponseRequired)) {
      const adminNotification: AdminNotification = {
        appName: translations[app.value.type],
        from: translations.your,
        appUrl: getAppUrl(app.id, languageParam),
      };
      adminNotifications.push(adminNotification);
    }
  }
  return adminNotifications;
};

const isRequestFromAdmin = (response: TseRespondTypeItem, respondentResponseRequired: string) => {
  return (
    respondentResponseRequired === YesOrNo.YES &&
    response.value.from === Applicant.ADMIN &&
    response.value.isResponseRequired === YesOrNo.YES &&
    (response.value.selectPartyRespond === Parties.RESPONDENT_ONLY ||
      response.value.selectPartyRespond.toLowerCase() === Parties.BOTH_PARTIES.toLowerCase()) // EW has 'Both parties'. Scottish had 'Both Parties'
  );
};

const getAppUrl = (appId: string, languageParam: string) => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', appId) + languageParam;
};
