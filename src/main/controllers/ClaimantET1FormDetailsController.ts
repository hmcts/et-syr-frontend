import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtil from '../utils/DateUtil';

export default class ClaimantET1FormDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM_DETAILS);
    let et1Document: ApiDocumentTypeItem;
    let formattedEt1FormDate: string;
    req.session?.userCase?.documentCollection?.forEach(function (tempDocument: ApiDocumentTypeItem): void {
      if (
        tempDocument.value?.documentType === AllDocumentTypes.ET1 ||
        tempDocument.value?.documentType === AllDocumentTypes.ET1
      ) {
        et1Document = tempDocument;
        formattedEt1FormDate = DateUtil.formatDateStringToDDMonthYYYY(tempDocument.value?.dateOfCorrespondence);
      }
    });
    res.render(TranslationKeys.CLAIMANT_ET1_FORM_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ET1_FORM_DETAILS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      et1Document,
      formattedEt1FormDate,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
