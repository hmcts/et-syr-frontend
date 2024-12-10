import { Application, ApplicationType, application } from '../definitions/contact-tribunal-applications';
import { AnyRecord } from '../definitions/util-types';

export const isTypeAOrB = (app: Application): boolean => {
  return app.type === ApplicationType.A || app.type === ApplicationType.B;
};

export const getApplicationByUrl = (url: string): Application | undefined => {
  return Object.values(application).find(app => app.url === url);
};

export const getApplicationKeyByCode = (code: string): string | undefined => {
  return Object.keys(application).find(key => application[key].code === code);
};

export const getApplicationKeyByUrl = (url: string): string | undefined => {
  return Object.keys(application).find(key => application[key].url === url);
};

export const getApplicationTypeByUrl = (url: string, translations: AnyRecord): string => {
  if (!url) {
    return '';
  }
  const key = getApplicationKeyByUrl(url);
  return key ? translations[key] : '';
};

export const getApplicationTypeByCode = (appCode: string, translations: AnyRecord): string => {
  if (!appCode) {
    return '';
  }
  const key = getApplicationKeyByCode(appCode);
  return key ? translations[key] : '';
};
