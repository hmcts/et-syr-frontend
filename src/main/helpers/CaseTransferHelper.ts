import { Response } from 'express';

import { CaseTransferInfoResponse, CaseTransferType } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi, isTransferredCaseAccessError } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('CaseTransferHelper');
const SESSION_SAVE_TIMEOUT_MS = 10000;

export const getSafeApiErrorSummary = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  const statusCodeMatch = message.match(/status code (\d{3})/i);

  if (statusCodeMatch) {
    return `HTTP ${statusCodeMatch[1]}`;
  }

  if (message.includes('CaseNotFoundException')) {
    return 'CaseNotFoundException';
  }

  if (message.toUpperCase().includes('CASE_TRANSFERRED')) {
    return 'CASE_TRANSFERRED';
  }

  if (message.includes('Session save timed out')) {
    return 'session save timed out';
  }

  if (message.toLowerCase().includes('session save')) {
    return 'session save error';
  }

  return 'unexpected error';
};

const getMatchingUserCase = (req: AppRequest, caseId: string) => {
  const userCase = req.session.userCase;
  return userCase && String(userCase.id) === String(caseId) ? userCase : undefined;
};

const findRespondent = (
  respondents: RespondentET3Model[] | undefined,
  ccdId: string | undefined,
  userId: string | undefined
): RespondentET3Model | undefined => {
  if (!respondents?.length) {
    return undefined;
  }

  if (StringUtils.isNotBlank(ccdId)) {
    const respondentByCcdId = respondents.find(respondent => respondent.ccdId === ccdId);
    if (respondentByCcdId) {
      return respondentByCcdId;
    }
  }

  if (StringUtils.isNotBlank(userId)) {
    return respondents.find(respondent => respondent.idamId === userId);
  }

  return undefined;
};

export const clearCaseTransferInfoIfStale = (req: AppRequest, caseId: string): void => {
  if (req.session.caseTransferInfo && String(req.session.caseTransferInfo.originalCaseId) !== String(caseId)) {
    req.session.caseTransferInfo = undefined;
  }
};

export const isTransferInfoForCase = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  return !!transferInfo?.transferred && String(transferInfo.originalCaseId) === String(caseId);
};

export const getRequestedCaseId = (req: AppRequest): string | undefined => {
  const caseId = req.query?.caseId;

  if (Array.isArray(caseId)) {
    return undefined;
  }

  if (typeof caseId === 'string' && caseId.trim()) {
    return caseId;
  }

  return req.session.caseTransferInfo?.originalCaseId;
};

export const getRequestedCcdId = (req: AppRequest): string | undefined => {
  const ccdId = req.query?.ccdId;

  if (Array.isArray(ccdId)) {
    return undefined;
  }

  if (typeof ccdId === 'string' && ccdId.trim()) {
    return ccdId;
  }

  return undefined;
};

export const enrichTransferInfoWithCaseParties = (
  req: AppRequest,
  transferInfo: CaseTransferInfoResponse,
  caseId: string,
  ccdId?: string
): CaseTransferInfoResponse => {
  const userCase = getMatchingUserCase(req, caseId);
  const existingTransferInfo =
    req.session.caseTransferInfo && String(req.session.caseTransferInfo.originalCaseId) === String(caseId)
      ? req.session.caseTransferInfo
      : undefined;
  const respondent = findRespondent(userCase?.respondents, ccdId, req.session.user?.id);
  const respondentNameFromSession = respondent ? ET3Util.getUserNameByRespondent(respondent) : undefined;

  return {
    ...transferInfo,
    claimantFirstName: transferInfo.claimantFirstName ?? existingTransferInfo?.claimantFirstName ?? userCase?.firstName,
    claimantLastName: transferInfo.claimantLastName ?? existingTransferInfo?.claimantLastName ?? userCase?.lastName,
    respondentName: transferInfo.respondentName ?? existingTransferInfo?.respondentName ?? respondentNameFromSession,
  };
};

export const getTransferredCaseNoAccessBody = (
  translations: Record<string, string>,
  transferType?: CaseTransferType
): string => {
  if (transferType === 'CROSS_COUNTRY') {
    return translations.noAccessBodyCrossCountry;
  }

  if (transferType === 'ECM') {
    return translations.noAccessBodyEcm;
  }

  if (transferType) {
    logger.warn(`Unknown transfer type "${transferType}". Using ECM copy.`);
  }

  return translations.noAccessBodyEcm;
};

export type LoadUserCaseResult = 'loaded' | 'transferred' | 'failed';

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
    return 'loaded';
  } catch (error) {
    logger.error(`Failed to load user case from API: ${getSafeApiErrorSummary(error)}`);
    if (await handleTransferredCaseRedirect(req, res, caseId, ccdId, error)) {
      return 'transferred';
    }
    return 'failed';
  }
};

export const applyCaseTransferInfoToSession = (
  req: AppRequest,
  transferInfo: CaseTransferInfoResponse,
  caseId: string,
  ccdId?: string
): CaseTransferInfoResponse => {
  const enrichedTransferInfo = enrichTransferInfoWithCaseParties(req, transferInfo, caseId, ccdId);
  req.session.caseTransferInfo = enrichedTransferInfo;
  return enrichedTransferInfo;
};

export const buildTransferredCasePageHeading = (
  translations: Record<string, string>,
  transferInfo: CaseTransferInfoResponse
): string => {
  const { claimantFirstName, claimantLastName, respondentName } = transferInfo;

  if (claimantFirstName && claimantLastName && respondentName) {
    return `${translations.header}${claimantFirstName} ${claimantLastName} vs ${respondentName}`;
  }

  return translations.title;
};

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string, ccdId?: string): string => {
  let url = `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
  if (StringUtils.isNotBlank(ccdId)) {
    url += `${DefaultValues.STRING_AMPERSAND}ccdId=${ccdId}`;
  }
  return url;
};

export const saveSessionAndRedirectToTransferredCase = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  transferInfo: CaseTransferInfoResponse,
  ccdId?: string
): Promise<boolean> => {
  const enrichedTransferInfo = enrichTransferInfoWithCaseParties(req, transferInfo, caseId, ccdId);
  const redirectUrl = buildTransferredCaseRedirectUrl(req, caseId, ccdId);

  req.session.caseTransferInfo = enrichedTransferInfo;

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Session save timed out after ${SESSION_SAVE_TIMEOUT_MS}ms`));
      }, SESSION_SAVE_TIMEOUT_MS);

      req.session.save(err => {
        clearTimeout(timeout);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (saveError) {
    req.session.caseTransferInfo = undefined;
    logger.error(
      `Failed to save session before transferred case redirect: ${getSafeApiErrorSummary(
        saveError
      )}. Redirecting with query params instead.`
    );
  }

  res.redirect(redirectUrl);
  return true;
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  ccdId?: string,
  accessError?: unknown
): Promise<boolean> => {
  if (accessError !== undefined && !isTransferredCaseAccessError(accessError)) {
    return false;
  }

  try {
    const transferInfoData = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;

    if (isTransferInfoForCase(caseId, transferInfoData)) {
      logger.info('Case has been transferred. Redirecting to transferred case page.');
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, transferInfoData, ccdId);
    }

    logger.info('Case is not transferred or transfer info does not match requested case.');
  } catch (transferError) {
    logger.warn(`Transfer check failed: ${getSafeApiErrorSummary(transferError)}`);
  }

  return false;
};
