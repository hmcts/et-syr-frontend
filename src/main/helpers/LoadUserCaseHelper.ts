import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getSafeApiErrorSummary, handleTransferredCaseRedirect } from '../helpers/CaseTransferHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('LoadUserCaseHelper');

export const LoadUserCaseResults = {
  LOADED: 'loaded',
  TRANSFERRED: 'transferred',
  FAILED: 'failed',
} as const;

export type LoadUserCaseResult = (typeof LoadUserCaseResults)[keyof typeof LoadUserCaseResults];

export const loadUserCaseFromApi = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  ccdId?: string
): Promise<LoadUserCaseResult> => {
  try {
    req.session.userCase = formatApiCaseDataToCaseWithId(
      (await getCaseApi(req.session.user?.accessToken).getUserCase(caseId)).data,
      req
    );
    return LoadUserCaseResults.LOADED;
  } catch (error) {
    logger.error(`Failed to load user case from API: ${getSafeApiErrorSummary(error)}`);
    if (await handleTransferredCaseRedirect(req, res, caseId, ccdId, error)) {
      return LoadUserCaseResults.TRANSFERRED;
    }
    return LoadUserCaseResults.FAILED;
  }
};
