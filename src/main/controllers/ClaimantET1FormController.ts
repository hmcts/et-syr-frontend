import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtil from '../utils/DateUtil';

export default class ClaimantET1FormController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const et1FormUrlValue = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM_DETAILS);
    const acasCertUrlValue = setUrlLanguage(req, PageUrls.CLAIMANT_ACAS_CERTIFICATE_DETAILS);
    let et1FormDocument: DocumentTypeItem;
    let acasCertificate: DocumentTypeItem;
    let formattedEt1FormDate: string;
    let formattedAcasCertificateDate: string;
    req.session?.userCase?.documentCollection?.forEach(function (tempDocument: ApiDocumentTypeItem): void {
      if (
        tempDocument.value?.documentType === AllDocumentTypes.ET1 ||
        tempDocument.value?.documentType === AllDocumentTypes.ET1
      ) {
        et1FormDocument = tempDocument;
        formattedEt1FormDate = DateUtil.formatDateFromYYYYMMDDAsDDMMYYYY(tempDocument.value?.dateOfCorrespondence);
      } else if (
        tempDocument.value?.documentType === AllDocumentTypes.ACAS_CERT ||
        tempDocument.value?.documentType === AllDocumentTypes.ACAS_CERT
      ) {
        acasCertificate = tempDocument;
        formattedAcasCertificateDate = DateUtil.formatDateFromYYYYMMDDAsDDMMYYYY(
          tempDocument.value?.dateOfCorrespondence
        );
      }
    });
    res.render(TranslationKeys.CLAIMANT_ET1_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ET1_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      et1FormUrlValue,
      acasCertUrlValue,
      et1FormDocument,
      acasCertificate,
      formattedEt1FormDate,
      formattedAcasCertificateDate,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
