import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';
import { RespondentUtils } from '../utils/RespondentUtils';

import { getLanguageParam } from './RouterHelpers';

export const removeRespondentRepresentative = async (req: AppRequest): Promise<string> => {
  await getCaseApi(req.session.user?.accessToken)?.removeRespondentRepresentative(req);
  return (
    '/case-details/' +
    req.session.userCase.id +
    '/' +
    RespondentUtils.findSelectedRespondentByRequest(req).ccdId +
    '?language=' +
    getLanguageParam(req.url)
  );
};
