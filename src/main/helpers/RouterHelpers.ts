import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { DefaultValues, ErrorPages, PageUrls, languages } from '../definitions/constants';
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

// Main function to redirect to the next page
export const returnNextPage = (req: AppRequest, res: Response, redirectUrl: string): void => {
  let nextPage = redirectUrl;
  if (req.session.returnUrl) {
    nextPage = req.session.returnUrl;
    req.session.returnUrl = undefined;
  }
  return res.redirect(returnValidUrl(nextPage));
};

export const returnValidUrl = (redirectUrl: string, validUrls?: string[]): string => {
  validUrls = validUrls ?? Object.values(PageUrls);

  // Parse the redirectUrl to get the pathname without query parameters
  const parsedUrl = new URL(redirectUrl, 'http://example.com'); // Base URL is required for parsing
  const pathWithoutQuery = parsedUrl.pathname;

  for (const url of validUrls) {
    if (pathWithoutQuery === url) {
      return redirectUrl; // Return the original URL with query parameters intact
    }
  }

  return ErrorPages.NOT_FOUND;
};

export const isClearSelection = (req: AppRequest): boolean => {
  return (
    req.query !== undefined &&
    req.query.redirect === DefaultValues.CLEAR_SELECTION &&
    req.session.userCase !== undefined
  );
};

export const isClearSelectionWithoutRequestUserCaseCheck = (req: AppRequest): boolean => {
  return req.query !== undefined && req.query.redirect === DefaultValues.CLEAR_SELECTION;
};

/**
 * Allows users to go through subsection when navigating back from CYA screens
 * It will only come to an end when endSubSection is called
 * and this will return them to returnUrl that was set originally
 *
 * forceRedirectUrl forces them to the next page of the subsection
 *
 * @param {AppRequest} req
 * @param {string} forceRedirectUrl
 * @return {Promise<void>}
 */
export const startSubSection = (req: AppRequest, forceRedirectUrl: string): void => {
  if (req.session.returnUrl) {
    req.session.subSectionUrl = req.session.returnUrl;
    req.session.returnUrl = forceRedirectUrl;
  }
};

/**
 * Allows users to end going through the subsection
 * This will return the users to the original returnUrl and reset subSectionUrl
 * Generally this is only used for CYA or summary screens, can be modified for specific urls if needed
 *
 *
 * @param {AppRequest} req
 * @return {Promise<void>}
 */
export const endSubSection = (req: AppRequest): void => {
  if (req.session.subSectionUrl) {
    if (
      req.session.subSectionUrl.includes(PageUrls.RESPONDENT_CONTACT_PREFERENCES) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM) ||
      req.session.subSectionUrl.includes(PageUrls.CHECK_YOUR_ANSWERS_ET3)
    ) {
      //set redirectUrl and then reset cyaSubSectionCompleteUrl
      req.session.returnUrl = req.session.subSectionUrl;
      req.session.subSectionUrl = undefined;
    }
  }
};

export const getCancelLink = (req: AppRequest): string => {
  const userCase = req.session?.userCase;
  const languageParam = getLanguageParam(req.url);
  return PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + '/' + userCase?.id + languageParam;
};
