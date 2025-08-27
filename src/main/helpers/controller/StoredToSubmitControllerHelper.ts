import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';

import { isYourApplication } from './YourRequestAndApplicationsHelper';

export const getYourStoredApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  return getYourStoredApplicationList(req)?.find(it => it.id === req.params.appId);
};

export const getYourStoredApplicationList = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  return req.session.userCase.tseRespondentStoredCollection?.filter(app =>
    isYourApplication(app.value, req.session.user)
  );
};
