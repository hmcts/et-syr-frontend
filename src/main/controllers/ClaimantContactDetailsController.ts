import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseType } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { SummaryListRow } from '../definitions/govuk/govukSummaryList';
import {
  getAdditionalClaimantsSummaryLists,
  getClaimantContactDetails
} from '../helpers/controller/ClaimantContactDetailsHelper';
import { getCaseApi } from '../services/CaseService';

export default class ClaimantContactDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const isGroupClaim = req.session.userCase?.caseType === CaseType.MULTIPLE;

    let additionalClaimantsSummaryLists: { name: string; rows: SummaryListRow[] }[] = [];
    const pdfDoc = req.session.multipleCase?.claimantContactDetailsDocument;
    const pdfDocWelsh = req.session.multipleCase?.claimantContactDetailsDocument;

    if (isGroupClaim) {
      if (!pdfDoc && !pdfDocWelsh) {
        const response = await getCaseApi(req.session.user?.accessToken).getMultipleAdditionalClaimants(
          req.session.userCase.caseTypeId,
          req.session.userCase.multipleReference
        );

        const additionalClaimants = response.data;
        additionalClaimantsSummaryLists = getAdditionalClaimantsSummaryLists(req, additionalClaimants);
      }
    }

    res.render(TranslationKeys.CLAIMANT_CONTACT_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_CONTACT_DETAILS as never, { returnObjects: true } as never),
      hideContactUs: true,
      claimantContactDetails: getClaimantContactDetails(req),
      isGroupClaim,
      additionalClaimantsSummaryLists,
      additionalClaimantsPdfUrl: pdfDoc.document_binary_url ?? undefined,
      additionalClaimantsPdfWelshUrl: pdfDoc.document_binary_url ?? undefined,
    });
  };
}
