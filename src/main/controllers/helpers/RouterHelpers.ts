import { languages } from '../../definitions/constants';

export const getLanguageParam = (url: string): string => {
  if (url?.includes('lng=cy')) {
    return languages.WELSH_URL_PARAMETER;
  }
  return languages.ENGLISH_URL_PARAMETER;
};
