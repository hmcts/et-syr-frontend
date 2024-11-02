import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys, languages } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtils from '../utils/DateUtils';

export default class ClaimantET1FormDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM_DETAILS);
    const languageParam: string = getLanguageParam(req.url);
    let et1Form: ApiDocumentTypeItem;
    if (languageParam === languages.WELSH_URL_PARAMETER) {
      et1Form = req.session.et1FormWelsh;
    } else {
      et1Form = req.session.et1FormEnglish;
    }
    const formattedEt1FormDate = DateUtils.formatDateStringToDDMonthYYYY(et1Form?.value?.dateOfCorrespondence);
    res.render(TranslationKeys.CLAIMANT_ET1_FORM_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ET1_FORM_DETAILS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      et1Form,
      formattedEt1FormDate,
      languageParam,
      welshEnabled,
    });
  }
}
