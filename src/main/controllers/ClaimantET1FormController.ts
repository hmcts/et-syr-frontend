import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentRow } from '../definitions/document';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ObjectUtils from '../utils/ObjectUtils';

const logger = getLogger('ClaimantET1FormController');

export default class ClaimantET1FormController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl: string = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const languageParam: string = getLanguageParam(req.url);
    let userCase: CaseWithId;
    try {
      userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req?.session?.userCase?.id)).data,
        req
      );
    } catch (error) {
      logger.error('unable to find user case for case id: ' + req?.session?.userCase?.id);
    }
    if (ObjectUtils.isNotEmpty(userCase)) {
      req.session.userCase = userCase;
    }
    const et1FormDocumentRow: DocumentRow = DocumentUtils.convertApiDocumentTypeItemToDocumentRow(
      req,
      DocumentUtils.findET1FormByRequestAndUrlLanguage(req)
    );
    const documentRows: DocumentRow[] = [];
    if (ObjectUtils.isNotEmpty(et1FormDocumentRow)) {
      documentRows.push(et1FormDocumentRow);
    }
    const acasCertificateRow: DocumentRow = DocumentUtils.convertApiDocumentTypeItemToDocumentRow(
      req,
      DocumentUtils.findAcasCertificateByRequest(req)
    );
    if (ObjectUtils.isNotEmpty(acasCertificateRow)) {
      documentRows.push(acasCertificateRow);
    }
    const et1AttachmentRows: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(
      req,
      DocumentUtils.findET1AttachmentsInDocumentCollection(req?.session?.userCase?.documentCollection)
    );

    if (CollectionUtils.isNotEmpty(et1AttachmentRows)) {
      for (const et1AttachmentRow of et1AttachmentRows) {
        documentRows.push(et1AttachmentRow);
      }
    }
    res.render(TranslationKeys.CLAIMANT_ET1_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ET1_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      documentRows,
      languageParam,
      welshEnabled,
    });
  }
}
