import { PageUrls, Urls, languages } from '../../definitions/constants';

export const noSignInRequiredEndpoints: string[] = [
  Urls.INFO,
  Urls.HOME,
  PageUrls.CASE_NUMBER_CHECK,
  PageUrls.RETURN_TO_EXISTING_RESPONSE,
  PageUrls.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE,
];

export const validateNoSignInEndpoints = (url: string): boolean => {
  const removeWelshQueryString = url.replace(languages.WELSH_URL_PARAMETER, '');
  const removeEnglishQueryString = url.replace(languages.ENGLISH_URL_PARAMETER, '');
  if (noSignInRequiredEndpoints.includes(removeWelshQueryString)) {
    return true;
  } else if (noSignInRequiredEndpoints.includes(removeEnglishQueryString)) {
    return true;
  }
  return false;
};
