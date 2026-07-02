import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import {
  applyCaseTransferInfoToSession,
  buildTransferredCasePageHeading,
  clearCaseTransferInfoIfStale,
} from '../helpers/CaseTransferHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('TransferredCaseController');

const hasMatchingTransferInfo = (caseId: string, transferInfo?: CaseTransferInfoResponse): boolean => {
  return !!transferInfo?.transferred && String(transferInfo.originalCaseId) === String(caseId);
};

const renderTransferredCasePage = (req: AppRequest, res: Response, transferInfo: CaseTransferInfoResponse): void => {
  const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
  const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
  const noAccessBody =
    transferInfo.transferType === 'ECM' ? translations.noAccessBodyEcm : translations.noAccessBodyCrossCountry;

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
  });
};

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = (req.query?.caseId as string) || req.session.caseTransferInfo?.originalCaseId;
    const ccdId = req.query?.ccdId as string | undefined;

    if (!caseId) {
      return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
    }

    clearCaseTransferInfoIfStale(req, caseId);

    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (!hasMatchingTransferInfo(caseId, transferInfo)) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        logger.info(`Fetched transfer info for case ID ${caseId}`);

        if (!transferInfo?.transferred) {
          logger.info(`Case ID ${caseId} is not transferred`);
          return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
        }

        transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId, ccdId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Unable to load transfer info for case ID ${caseId}: ${errorMessage}`);
        return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
      }
    } else if (transferInfo) {
      transferInfo = applyCaseTransferInfoToSession(req, transferInfo, caseId, ccdId);
    }

    if (!transferInfo?.transferred) {
      return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
    }

    renderTransferredCasePage(req, res, transferInfo);
  }
}
