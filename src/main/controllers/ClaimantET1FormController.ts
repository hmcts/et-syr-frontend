import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DocumentUtils from '../utils/DocumentUtils';

export default class ClaimantET1FormController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl: string = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const languageParam: string = getLanguageParam(req.url);
    const et1FormDocument: ApiDocumentTypeItem = DocumentUtils.findET1FormByRequestAndUrlLanguage(req);
    const et1FormDocumentAsGovUkTableRow: { html?: string }[] = DocumentUtils.convertDocumentListToGovUkTableRows([
      et1FormDocument,
    ]);
    const acasCertificate: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByRequest(req);
    const acasCertificateToGovUkTableRow: { html?: string }[] = DocumentUtils.convertDocumentListToGovUkTableRows([
      acasCertificate,
    ]);
    const et1Attachments: ApiDocumentTypeItem[] = DocumentUtils.findET1AttachmentsInDocumentCollection(
      req?.session?.userCase?.documentCollection
    );
    const et1AttachmentsAsGovUkTableRow: { html?: string }[] =
      DocumentUtils.convertDocumentListToGovUkTableRows(et1Attachments);
    res.render(TranslationKeys.CLAIMANT_ET1_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ET1_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      et1FormDocumentAsGovUkTableRow,
      acasCertificateToGovUkTableRow,
      et1AttachmentsAsGovUkTableRow,
      languageParam,
      welshEnabled,
    });
  }
}
