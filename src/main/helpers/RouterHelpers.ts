import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, languages } from '../definitions/constants';
import { FormFields } from '../definitions/form';

export const getLanguageParam = (url: string): string => {
  if (url?.includes(languages.WELSH_URL_POSTFIX)) {
    return languages.WELSH_URL_PARAMETER;
  }
  return languages.ENGLISH_URL_PARAMETER;
};

export const conditionalRedirect = (
  req: AppRequest,
  formFields: FormFields,
  condition: boolean | string | string[]
): boolean => {
  const matchingValues = Object.entries(req.body).find(([k]) => Object.keys(formFields).some(ff => ff === k));
  if (Array.isArray(condition) && matchingValues) {
    return matchingValues.some(v => {
      return condition.some(c => (Array.isArray(v) ? v.some(e => String(e) === c) : v.includes(c)));
    });
  }
  return matchingValues?.some(v => v === condition);
};

// Function to handle return URL with safety check
export const handleReturnUrl = (req: AppRequest, redirectUrl: string): string => {
  let nextPage = redirectUrl;
  if (req.session.returnUrl) {
    nextPage = req.session.returnUrl;
    req.session.returnUrl = undefined;
  }
  return returnValidUrl(nextPage);
};

// Main function to redirect to the next page
export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  return res.redirect(handleReturnUrl(req, redirectUrl));
};

export const returnValidUrl = (redirectUrl: string, validUrls?: string[]): string => {
  validUrls = validUrls ?? Object.values(PageUrls); // if undefined use PageURLs

  for (const url of validUrls) {
    const welshUrl = url + languages.WELSH_URL_PARAMETER;
    const englishUrl = url + languages.ENGLISH_URL_PARAMETER;
    if (redirectUrl === url) {
      return url;
    } else if (redirectUrl === welshUrl) {
      return welshUrl;
    } else if (redirectUrl === englishUrl) {
      return englishUrl;
    }
  }
  return ErrorPages.NOT_FOUND;
};

export const isClearSelection = (req: AppRequest): boolean => {
  return req.query !== undefined && req.query.redirect === 'clearSelection' && req.session.userCase !== undefined;
};

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  const languageParam = getLanguageParam(req.url);
  return PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + '/' + userCase?.id + languageParam;
};
