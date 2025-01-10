// Used in API Formatter
import { retrieveCurrentLocale } from './ApplicationTableRecordTranslationHelper';

export const returnTranslatedDateString = (dateString: string, locale: string): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const returnTodayPlus7 = (url: string): string => {
  const applicationDate = new Date();
  applicationDate.setDate(applicationDate.getDate() + 7);
  return applicationDate.toLocaleDateString(retrieveCurrentLocale(url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
