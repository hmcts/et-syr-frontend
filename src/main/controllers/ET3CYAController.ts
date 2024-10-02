import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
} from '../helpers/controller/ET3CYAHelper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ET3CYAController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ET3_CYA);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    // TODO: ET3 cya data needs to be populated AND Submit & Save for Later buttons
    res.render(TranslationKeys.RESPONDENT_ET3_CYA, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ET3_CYA as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      hideContactUs: true,
      et3ResponseSection1: getEt3Section1(userCase, sectionTranslations),
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations),
      et3ResponseSection3: getEt3Section3(userCase, sectionTranslations),
      et3ResponseSection4: getEt3Section4(userCase, sectionTranslations),
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations),
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
