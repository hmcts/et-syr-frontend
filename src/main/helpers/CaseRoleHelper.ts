import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

import { getLanguageParam } from './RouterHelpers';

export const removeRespondentRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeRespondentRepresentative(req);
  return '/citizen-hub/' + req.session.userCase.id + '?language=' + getLanguageParam(req.url);
};
