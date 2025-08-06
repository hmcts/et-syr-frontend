import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

export const removeRespondentRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeRespondentRepresentative(req);
  return (
    '/case-details/' + req.session.userCase.id + '/' + req.session.user.id + '?language=' + getLanguageParam(req.url)
  );
};
