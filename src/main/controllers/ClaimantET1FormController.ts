import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentRow } from '../definitions/document';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import CollectionUtils from '../utils/CollectionUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ObjectUtils from '../utils/ObjectUtils';

export default class ClaimantET1FormController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl: string = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const languageParam: string = getLanguageParam(req.url);
    const et1FormDocumentRow: DocumentRow = DocumentUtils.convertApiDocumentTypeItemToDocumentRow(
      DocumentUtils.findET1FormByRequestAndUrlLanguage(req)
    );
    const documentRows: DocumentRow[] = [];
    if (ObjectUtils.isNotEmpty(et1FormDocumentRow)) {
      documentRows.push(et1FormDocumentRow);
    }
    const acasCertificateRow: DocumentRow = DocumentUtils.convertApiDocumentTypeItemToDocumentRow(
      DocumentUtils.findAcasCertificateByRequest(req)
    );
    if (ObjectUtils.isNotEmpty(acasCertificateRow)) {
      documentRows.push(acasCertificateRow);
    }
    const et1AttachmentRows: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(
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
