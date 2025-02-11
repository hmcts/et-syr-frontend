import { Application, ApplicationType, application } from '../definitions/contact-tribunal-applications';
import { AnyRecord } from '../definitions/util-types';

export const getApplicationByCode = (code: string): Application | undefined => {
  return Object.values(application).find(app => app.code === code);
};

export const getApplicationByUrl = (url: string): Application | undefined => {
  return Object.values(application).find(app => app.url === url);
};

export const getApplicationKey = (app: Application): string | undefined => {
  return Object.keys(application).find(key => application[key] === app);
};

export const isTypeAOrB = (app: Application): boolean => {
  return app.type === ApplicationType.A || app.type === ApplicationType.B;
};

/**
 * Get Application Type as heading by url
 * @param url url of application
 * @param translations translation of the page
 */
export const getApplicationDisplayByUrl = (url: string, translations: AnyRecord): string => {
  const appKey = Object.keys(application).find(key => application[key].url === url);
  return appKey ? translations[appKey] : '';
};

/**
 * Get Application Type as heading by application code
 * @param appCode code of application
 * @param translations translation of the page
 */
export const getApplicationDisplayByCode = (appCode: string, translations: AnyRecord): string => {
  const appKey = Object.keys(application).find(key => application[key].code === appCode);
  return appKey ? translations[appKey] : '';
};

/**
 * Get Application Type as heading by application code
 * @param appCode code of application
 * @param translations translation of the page
 */
export const getApplicationDisplayByClaimantCode = (appCode: string, translations: AnyRecord): string => {
  const appKey = Object.keys(application).find(key => application[key].claimant === appCode);
  return appKey ? translations[appKey] : '';
};
