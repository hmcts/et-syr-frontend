import { AppRequest } from '../definitions/appRequest';
import { DefaultValues, PageUrls, languages } from '../definitions/constants';
import CollectionUtils from '../utils/CollectionUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string, validUrls?: string[]): string => {
  if (StringUtils.isBlank(req.url) && StringUtils.isBlank(redirectUrl)) {
    return DefaultValues.STRING_HASH;
  }
  if (StringUtils.isBlank(redirectUrl)) {
    return addLanguageParameterToUrl(req, req.url, validUrls);
  }
  const requestParams: string[] = UrlUtils.getRequestParamsFromUrl(req.url);
  if (CollectionUtils.isNotEmpty(requestParams)) {
    for (const param of requestParams) {
      if (param !== languages.WELSH_URL_POSTFIX && param !== languages.ENGLISH_URL_POSTFIX) {
        redirectUrl = addParameterToUrl(redirectUrl, param);
      }
    }
  }
  return addLanguageParameterToUrl(req, redirectUrl, validUrls);
};

export const addLanguageParameterToUrl = (req: AppRequest, redirectUrl: string, validUrls?: string[]): string => {
  if (StringUtils.isNotBlank(req?.url) && req?.url.includes(languages.WELSH_URL_POSTFIX)) {
    redirectUrl = addParameterToUrl(redirectUrl, languages.WELSH_URL_POSTFIX, validUrls);
    req.session.lang = languages.WELSH;
  } else if (StringUtils.isNotBlank(req?.url) && req?.url.includes(languages.ENGLISH_URL_POSTFIX)) {
    redirectUrl = addParameterToUrl(redirectUrl, languages.ENGLISH_URL_POSTFIX, validUrls);
    req.session.lang = languages.ENGLISH;
  }
  return redirectUrl;
};

export const addParameterToUrl = (url: string, parameter: string, validUrls?: string[]): string => {
  if (StringUtils.isBlank(url)) {
    return DefaultValues.STRING_EMPTY;
  }
  if (StringUtils.isBlank(parameter)) {
    return url;
  }
  if (!url.includes(parameter)) {
    if (url.includes(DefaultValues.STRING_QUESTION_MARK)) {
      url = UrlUtils.isValidUrl(url + DefaultValues.STRING_AMPERSAND + parameter, validUrls)
        ? url + DefaultValues.STRING_AMPERSAND + parameter
        : PageUrls.NOT_FOUND;
    } else {
      url = UrlUtils.isValidUrl(url + DefaultValues.STRING_QUESTION_MARK + parameter, validUrls)
        ? url + DefaultValues.STRING_QUESTION_MARK + parameter
        : PageUrls.NOT_FOUND;
    }
  }
  return url;
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
