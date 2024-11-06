import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys, languages } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtils from '../utils/DateUtils';
import DocumentUtils from '../utils/DocumentUtils';

export default class ClaimantET1FormController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl: string = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const et1FormUrlValue: string = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM_DETAILS);
    const acasCertUrlValue: string = setUrlLanguage(req, PageUrls.CLAIMANT_ACAS_CERTIFICATE_DETAILS);
    const languageParam: string = getLanguageParam(req.url);
    let et1FormDocument: ApiDocumentTypeItem;
    req.session.et1FormEnglish = DocumentUtils.findET1DocumentByLanguage(
      req.session?.userCase?.documentCollection as ApiDocumentTypeItem[],
      languages.ENGLISH_URL_PARAMETER
    );
    req.session.et1FormWelsh = DocumentUtils.findET1DocumentByLanguage(
      req.session?.userCase?.documentCollection as ApiDocumentTypeItem[],
      languages.WELSH_URL_PARAMETER
    );
    if (languages.WELSH_URL_PARAMETER === languageParam && req.session.et1FormWelsh !== undefined) {
      et1FormDocument = req.session.et1FormWelsh;
    } else {
      et1FormDocument = req.session.et1FormEnglish;
    }
    const formattedEt1FormDate: string = DateUtils.formatDateStringToDDMonthYYYY(
      et1FormDocument?.value?.dateOfCorrespondence
    );
    const acasCertificate: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByAcasNumber(
      req.session?.userCase?.documentCollection as ApiDocumentTypeItem[],
      req.session?.userCase?.acasCertNum
    );
    req.session.selectedAcasCertificate = acasCertificate;
    const formattedAcasCertificateDate: string = DateUtils.formatDateStringToDDMonthYYYY(
      acasCertificate?.value?.dateOfCorrespondence
    );

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
      languageParam,
      welshEnabled,
    });
  }
}
