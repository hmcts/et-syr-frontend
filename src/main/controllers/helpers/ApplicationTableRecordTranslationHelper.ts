// Used in API Formatter
export const retrieveCurrentLocale = (url: string): string => {
  return url && url.includes('?lng=cy') ? 'cy' : 'en-GB';
};
