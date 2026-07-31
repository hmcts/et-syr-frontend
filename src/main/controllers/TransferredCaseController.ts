import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import {
  applyCaseTransferInfoToSession,
  buildTransferredCasePageHeading,
  clearCaseTransferInfoIfStale,
  getRequestedCaseId,
  getRequestedCcdId,
  getSafeApiErrorSummary,
  getTransferredCaseNoAccessBody,
  getTransferredCaseWhatHappensNextPointTwo,
  isTransferInfoForCase,
} from '../helpers/CaseTransferHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('TransferredCaseController');

const needsTransferInfoRefresh = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  if (!isTransferInfoForCase(caseId, transferInfo)) {
    return true;
  }

  return !transferInfo.transferComplete;
};

const renderTransferredCasePage = (req: AppRequest, res: Response, transferInfo: CaseTransferInfoResponse): void => {
  const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
  const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
  const noAccessBody = getTransferredCaseNoAccessBody(translations, transferInfo.transferType);
  const whatHappensNextPointTwo = getTransferredCaseWhatHappensNextPointTwo(translations, showNewCaseNumber);

  res.render(TranslationKeys.TRANSFERRED_CASE, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
    ...translations,
    pageHeading: buildTransferredCasePageHeading(translations, transferInfo),
    caseNumber: transferInfo.originalEthosCaseReference ?? '',
    replacementCaseNumber: transferInfo.newEthosCaseReference ?? '',
    transferComplete: transferInfo.transferComplete,
    showNewCaseNumber,
    noAccessBody,
    whatHappensNextPointTwo,
  });
};

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = getRequestedCaseId(req);
    const ccdId = getRequestedCcdId(req);

    if (!caseId) {
      return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
    }

    clearCaseTransferInfoIfStale(req, caseId);

    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (needsTransferInfoRefresh(caseId, transferInfo)) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        logger.info('Fetched transfer info for transferred case page');

        if (!isTransferInfoForCase(caseId, transferInfo)) {
          logger.info('Transfer info is invalid or does not match requested case');
          return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
        }

        transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId, ccdId);
      } catch (error) {
        logger.error(`Unable to load transfer info: ${getSafeApiErrorSummary(error)}`);
        return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
      }
    } else if (transferInfo) {
      transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId, ccdId);
    }

    if (!isTransferInfoForCase(caseId, transferInfo)) {
      return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
    }

    renderTransferredCasePage(req, res, transferInfo);
  }
}
