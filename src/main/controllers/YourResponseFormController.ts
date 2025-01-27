import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CLAIM_TYPES, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
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
import CollectionUtils from '../utils/CollectionUtils';
import DocumentUtils from '../utils/DocumentUtils';

export default class YourResponseFormController {
  constructor() {}
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl: string = setUrlLanguage(req, PageUrls.YOUR_RESPONSE_FORM);
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const et3FormId: string = DocumentUtils.findET3FormIdByRequest(req);
    let isSection6Visible = false;
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.typeOfClaim) &&
      (req.session.userCase.typeOfClaim.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) ||
        req.session.userCase.typeOfClaim.includes(TypesOfClaim.BREACH_OF_CONTRACT))
    ) {
      isSection6Visible = true;
    }
    const userCase = req.session.userCase;
    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };
    res.render(TranslationKeys.YOUR_RESPONSE_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.YOUR_RESPONSE_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      hideContactUs: true,
      sessionErrors: req.session.errors,
      et3ResponseSection1: getEt3Section1(req, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      et3ResponseSection3: getEt3Section3(req, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      et3ResponseSection4: getEt3Section4(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      et3ResponseSection6: getEt3Section6(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE, true),
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
      isSection6Visible,
      et3FormId,
    });
  };
}
