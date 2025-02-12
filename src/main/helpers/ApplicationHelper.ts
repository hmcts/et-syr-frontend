import { Application, ApplicationType, application } from '../definitions/contact-tribunal-applications';
import { AnyRecord } from '../definitions/util-types';

/**
 * Get application by code
 * @param code application code
 */
export const getApplicationByCode = (code: string): Application | undefined => {
  return Object.values(application).find(app => app.code === code);
};

/**
 * Get application by url
 * @param url application url
 */
export const getApplicationByUrl = (url: string): Application | undefined => {
  return Object.values(application).find(app => app.url === url);
};

/**
 * Get application by key
 * @param app application key
 */
export const getApplicationKey = (app: Application): string | undefined => {
  return Object.keys(application).find(key => application[key] === app);
};

/**
 * Check if application is Type A or Type B
 * @param app selected application
 */
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
