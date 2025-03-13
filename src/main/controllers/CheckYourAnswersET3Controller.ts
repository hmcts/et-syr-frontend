import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CLAIM_TYPES, ET3ModificationTypes, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
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
import ET3Util from '../utils/ET3Util';

export default class CheckYourAnswersET3Controller {
  readonly form: Form;
  private readonly checkYourAnswers: FormContent = {
    fields: {
      submit: {
        label: (l: AnyRecord): string => l.submit,
        id: 'submit',
        type: 'button',
        name: 'submit',
        value: 'true',
        divider: false,
      },
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.checkYourAnswers.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam: string = getLanguageParam(req.url);
    if (req.body.saveAsDraft) {
      return res.redirect(returnValidUrl(PageUrls.RESPONSE_SAVED + languageParam));
    }
    const userCase = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.CheckYorAnswers,
      LinkStatus.COMPLETED,
      ET3ModificationTypes.MODIFICATION_TYPE_SUBMIT
    );
    if (!userCase) {
      return res.redirect(returnValidUrl(req.url));
    }
    req.session.userCase = userCase;
    if (req.body?.submit) {
      return res.redirect(returnValidUrl(PageUrls.APPLICATION_SUBMITTED + languageParam));
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_ET3);
    const userCase = req.session.userCase;
    let isSection6Visible = false;
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.typeOfClaim) &&
      (req.session.userCase.typeOfClaim.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) ||
        req.session.userCase.typeOfClaim.includes(TypesOfClaim.BREACH_OF_CONTRACT))
    ) {
      isSection6Visible = true;
    }
    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    // TODO: ET3 cya data needs to be populated AND Submit & Save for Later buttons
    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_ET3, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3 as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      hideContactUs: true,
      sessionErrors: req.session.errors,
      et3ResponseSection1: getEt3Section1(req, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection3: getEt3Section3(req, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection4: getEt3Section4(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection6: getEt3Section6(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
      isSection6Visible,
      form: this.checkYourAnswers,
    });
  };
}
