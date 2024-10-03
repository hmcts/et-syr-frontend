import { AppRequest } from '../definitions/appRequest';
import { languages } from '../definitions/constants';

// Used for invoking PCQ surver.
export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  if (req.url?.includes(languages.WELSH_URL_PARAMETER)) {
    redirectUrl += languages.WELSH_URL_PARAMETER;
    req.session.lang = languages.WELSH;
  }
  if (req.url?.includes(languages.ENGLISH_URL_PARAMETER)) {
    redirectUrl += languages.ENGLISH_URL_PARAMETER;
    req.session.lang = languages.ENGLISH;
  }
  return redirectUrl;
};

export const setChangeAnswersUrlLanguage = (req: AppRequest): string => {
  if (req.cookies.i18next === languages.WELSH) {
    return languages.WELSH_URL_PARAMETER;
  }
  return languages.ENGLISH_URL_PARAMETER;
};

export const setCheckAnswersLanguage = (req: AppRequest, sessionUrl: string): string => {
  if (req.cookies.i18next === languages.WELSH) {
    return sessionUrl + languages.WELSH_URL_PARAMETER;
  }
  return sessionUrl + languages.ENGLISH_URL_PARAMETER;
};
