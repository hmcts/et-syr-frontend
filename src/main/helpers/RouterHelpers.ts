import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, languages } from '../definitions/constants';
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

export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  return res.redirect(handleReturnUrl(req, redirectUrl));
};

const handleReturnUrl = (req: AppRequest, redirectUrl: string): string => {
  let nextPage = redirectUrl;
  if (req.session.returnUrl) {
    nextPage = req.session.returnUrl;
    req.session.returnUrl = undefined;
  }
  return nextPage;
};

export const returnValidUrl = (redirectUrl: string, validUrls: string[]): string => {
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
