import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls } from '../definitions/constants';

import { isYourApplication } from './controller/YourRequestAndApplicationsHelper';

export const getSelectedStoredApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  return getYourStoredApplicationList(req)?.find(it => it.id === req.params.appId);
};

export const getYourStoredApplicationList = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  return req.session.userCase.tseRespondentStoredCollection?.filter(app =>
    isYourApplication(app.value, req.session.user)
  );
};

export const getAppDetailsLink = (appId: string, languageParam: string): string => {
  return PageUrls.APPLICATION_DETAILS.replace(':appId', appId) + languageParam;
};
