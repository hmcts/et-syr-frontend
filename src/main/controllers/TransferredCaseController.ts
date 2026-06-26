import { Response } from 'express';

import { CaseTransferInfoResponse } from '../definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../definitions/appRequest';
import { DefaultValues, TranslationKeys } from '../definitions/constants';
import { getNoAccessBody, resolveTransferredCasePartyNames } from '../helpers/CaseTransferHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('TransferredCaseController');

export default class TransferredCaseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const caseId = (req.query.caseId as string) || req.session.caseTransferInfo?.originalCaseId;
    const ccdId = req.query.ccdId as string | undefined;
    let transferInfo: CaseTransferInfoResponse | undefined = req.session.caseTransferInfo;

    if (caseId && (!transferInfo || transferInfo.originalCaseId !== caseId)) {
      try {
        transferInfo = (await getCaseApi(req.session.user?.accessToken).getCaseTransferInfo(caseId)).data;
        req.session.caseTransferInfo = transferInfo;
      } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        return res.redirect('/not-found');
      }
    }

    if (!transferInfo?.transferred) {
      return res.redirect('/not-found');
    }

    const translations = req.t(TranslationKeys.TRANSFERRED_CASE, { returnObjects: true }) as Record<string, string>;
    const sidebarTranslations = req.t(TranslationKeys.SIDEBAR_CONTACT_US, {
      returnObjects: true,
    }) as Record<string, unknown>;
    const caseDetailsTranslations = req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
      returnObjects: true,
    }) as Record<string, string>;
    const { claimantName, respondentName } = await resolveTransferredCasePartyNames(req, caseId, ccdId);
    const showNewCaseNumber = transferInfo.transferComplete && !!transferInfo.newEthosCaseReference;
    const caseOverviewTitle = buildCaseOverviewTitle(
      caseDetailsTranslations.header,
      claimantName,
      respondentName,
      translations.caseOverviewFallback
    );

    res.render(TranslationKeys.TRANSFERRED_CASE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...sidebarTranslations,
      ...translations,
      caseOverviewTitle,
      caseNumber: transferInfo.originalEthosCaseReference ?? DefaultValues.STRING_EMPTY,
      replacementCaseNumber: transferInfo.newEthosCaseReference ?? DefaultValues.STRING_EMPTY,
      transferComplete: transferInfo.transferComplete,
      showNewCaseNumber,
      noAccessBody: getNoAccessBody(transferInfo, translations),
    });
  }
}

const buildCaseOverviewTitle = (
  header: string,
  claimantName: string,
  respondentName: string,
  fallbackTitle: string
): string => {
  if (StringUtils.isBlank(claimantName) || StringUtils.isBlank(respondentName)) {
    return fallbackTitle;
  }
  return `${header}${claimantName} vs ${respondentName}`;
};
