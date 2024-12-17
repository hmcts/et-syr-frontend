import { Application, ApplicationType, application } from '../definitions/contact-tribunal-applications';

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
