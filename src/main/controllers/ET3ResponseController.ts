import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
  getEt3Section6,
} from '../helpers/controller/CheckYourAnswersET3Helper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ET3ResponseController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ET3_RESPONSE);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.RESPONDENT_ET3_RESPONSE, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ET3_RESPONSE as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      userCase,
      et3ResponseSection1: getEt3Section1(req, sectionTranslations, undefined, true),
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations, undefined, true),
      et3ResponseSection3: getEt3Section3(userCase, sectionTranslations, undefined, true),
      et3ResponseSection4: getEt3Section4(userCase, sectionTranslations, undefined, true),
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, undefined, true),
      et3ResponseSection6: getEt3Section6(userCase, sectionTranslations, undefined, true),
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
