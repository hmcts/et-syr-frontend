import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('CaseTransferHelper');
const SESSION_SAVE_TIMEOUT_MS = 10000;

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

  return respondents[0];
};

export const clearCaseTransferInfoIfStale = (req: AppRequest, caseId: string): void => {
  if (req.session.caseTransferInfo && String(req.session.caseTransferInfo.originalCaseId) !== String(caseId)) {
    req.session.caseTransferInfo = undefined;
  }
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
    respondentName:
      transferInfo.respondentName ??
      existingTransferInfo?.respondentName ??
      respondentNameFromSession ??
      userCase?.respondents?.[0]?.respondentName,
  };
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
  applyCaseTransferInfoToSession(req, transferInfo, caseId, ccdId);
  const redirectUrl = buildTransferredCaseRedirectUrl(req, caseId, ccdId);

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
    const saveErrorMessage = saveError instanceof Error ? saveError.message : String(saveError);
    logger.error(
      `Failed to save session before transferred case redirect for case ID ${caseId}: ${saveErrorMessage}. Redirecting anyway.`
    );
  }

  res.redirect(redirectUrl);
  return true;
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  ccdId?: string
): Promise<boolean> => {
  try {
    const transferInfoData = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;

    if (transferInfoData?.transferred) {
      logger.info(`Case ID ${caseId} has been transferred. Redirecting to transferred case page.`);
      return saveSessionAndRedirectToTransferredCase(req, res, caseId, transferInfoData, ccdId);
    }

    logger.info(`Case ID ${caseId} is not transferred according to transfer-info response.`);
  } catch (transferError) {
    const transferErrorMessage = transferError instanceof Error ? transferError.message : String(transferError);
    logger.warn(`Case ID ${caseId} transfer check failed: ${transferErrorMessage}`);
  }

  return false;
};

export const handleCaseAccessFailure = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  ccdId?: string
): Promise<boolean> => {
  return handleTransferredCaseRedirect(req, res, caseId, ccdId);
};
