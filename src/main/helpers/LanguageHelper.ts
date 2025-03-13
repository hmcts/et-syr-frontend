import { AppRequest } from '../definitions/appRequest';
import { DefaultValues, PageUrls, languages } from '../definitions/constants';
import CollectionUtils from '../utils/CollectionUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export const setUrlLanguage = (req: AppRequest, redirectUrl: string): string => {
  if (StringUtils.isBlank(req.url) && StringUtils.isBlank(redirectUrl)) {
    return DefaultValues.STRING_HASH;
  }
  if (StringUtils.isBlank(redirectUrl)) {
    return addLanguageParameterToUrl(req, req.url);
  }
  const requestParams: string[] = UrlUtils.getRequestParamsFromUrl(req.url);
  if (CollectionUtils.isNotEmpty(requestParams)) {
    for (const param of requestParams) {
      if (param !== languages.WELSH_URL_POSTFIX && param !== languages.ENGLISH_URL_POSTFIX) {
        redirectUrl = addParameterToUrl(redirectUrl, param);
      }
    }
  }
  return addLanguageParameterToUrl(req, redirectUrl);
};

export const addLanguageParameterToUrl = (req: AppRequest, redirectUrl: string): string => {
  if (StringUtils.isNotBlank(req?.url) && req?.url.includes(languages.WELSH_URL_POSTFIX)) {
    redirectUrl = addParameterToUrl(redirectUrl, languages.WELSH_URL_POSTFIX);
    req.session.lang = languages.WELSH;
  } else if (StringUtils.isNotBlank(req?.url) && req?.url.includes(languages.ENGLISH_URL_POSTFIX)) {
    redirectUrl = addParameterToUrl(redirectUrl, languages.ENGLISH_URL_POSTFIX);
    req.session.lang = languages.ENGLISH;
  }
  return redirectUrl;
};

export const addParameterToUrl = (url: string, parameter: string): string => {
  if (StringUtils.isBlank(url)) {
    return DefaultValues.STRING_EMPTY;
  }
  if (StringUtils.isBlank(parameter)) {
    return url;
  }
  if (!url.includes(parameter)) {
    if (url.includes(DefaultValues.STRING_QUESTION_MARK)) {
      url = containsBasePath(url + DefaultValues.STRING_AMPERSAND + parameter)
        ? url + DefaultValues.STRING_AMPERSAND + parameter
        : PageUrls.NOT_FOUND;
    } else {
      url = containsBasePath(url + DefaultValues.STRING_QUESTION_MARK + parameter)
        ? url + DefaultValues.STRING_QUESTION_MARK + parameter
        : PageUrls.NOT_FOUND;
    }
  }
  return url;
};

// Convert object values to an array of paths
const basePaths = Object.values(PageUrls)
  .map(path => path.replace(/:[^/]+/g, '[^/]+')) // Replace dynamic params with regex match
  .map(path => path.replace(/\//g, '\\/')); // Escape slashes for regex

// Construct regex that matches the base paths only at the start of pathname
const regexPattern = new RegExp(`^(${basePaths.join('|')})($|/)`);

// Function to check if a URL contains a valid base path
export const containsBasePath = (url: string): boolean => {
  try {
    const pathname = new URL(url).pathname; // Extract pathname from URL
    return regexPattern.test(pathname); // Test only against pathname
  } catch {
    return false; // Return false for invalid URLs
  }
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
