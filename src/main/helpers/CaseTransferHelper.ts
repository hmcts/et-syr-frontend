import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('CaseTransferHelper');

export const buildTransferredCaseRedirectUrl = (req: AppRequest, caseId: string, ccdId?: string): string => {
  let url = `${PageUrls.TRANSFERRED_CASE}${getLanguageParam(req.url)}&caseId=${caseId}`;
  if (StringUtils.isNotBlank(ccdId)) {
    url += `${DefaultValues.STRING_AMPERSAND}ccdId=${ccdId}`;
  }
  return url;
};

export const handleTransferredCaseRedirect = async (
  req: AppRequest,
  res: Response,
  caseId: string,
  ccdId?: string
): Promise<boolean> => {
  try {
    const transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
    if (transferInfo?.transferred) {
      req.session.caseTransferInfo = transferInfo;
      res.redirect(buildTransferredCaseRedirectUrl(req, caseId, ccdId));
      return true;
    }
  } catch (transferError) {
    logger.error(transferError instanceof Error ? transferError.message : String(transferError));
  }
  return false;
};

export const resolveTransferredCasePartyNames = async (
  req: AppRequest,
  caseId: string,
  ccdId?: string
): Promise<{ claimantName: string; respondentName: string }> => {
  const fromSession = getPartyNamesFromSession(req, caseId, ccdId);
  if (fromSession) {
    return fromSession;
  }

  try {
    const cases = (await getCaseApi(req.session.user?.accessToken).getUserCases()).data;
    const matchingCase = cases?.find(userCase => userCase.id?.toString() === caseId);
    if (matchingCase) {
      const formattedCase = formatApiCaseDataToCaseWithId(matchingCase, req);
      const respondent = findRespondent(formattedCase.respondents, ccdId, req.session.user?.id);
      return {
        claimantName: `${formattedCase.firstName ?? DefaultValues.STRING_EMPTY} ${
          formattedCase.lastName ?? DefaultValues.STRING_EMPTY
        }`.trim(),
        respondentName: ET3Util.getUserNameByRespondent(respondent),
      };
    }
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
  }

  return { claimantName: DefaultValues.STRING_EMPTY, respondentName: DefaultValues.STRING_EMPTY };
};

const getPartyNamesFromSession = (
  req: AppRequest,
  caseId: string,
  ccdId?: string
): { claimantName: string; respondentName: string } | undefined => {
  if (!req.session.userCase || req.session.userCase.id !== caseId) {
    return undefined;
  }

  const respondent = findRespondent(req.session.userCase.respondents, ccdId, req.session.user?.id);
  if (!respondent) {
    return undefined;
  }

  return {
    claimantName: `${req.session.userCase.firstName ?? DefaultValues.STRING_EMPTY} ${
      req.session.userCase.lastName ?? DefaultValues.STRING_EMPTY
    }`.trim(),
    respondentName: ET3Util.getUserNameByRespondent(respondent),
  };
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

export const getNoAccessBody = (
  transferInfo: CaseTransferInfoResponse,
  translations: Record<string, string>
): string => {
  return transferInfo.transferType === 'ECM' ? translations.noAccessBodyEcm : translations.noAccessBodyCrossCountry;
};
