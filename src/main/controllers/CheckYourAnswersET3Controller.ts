import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { ET3ModificationTypes, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
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
      saveAsDraft: {
        label: (l: AnyRecord): string => l.saveForLater,
        id: 'saveAsDraft',
        type: 'button',
        name: 'saveAsDraft',
        value: 'true',
        divider: false,
        classes: 'govuk-button--secondary',
      },
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.checkYourAnswers.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.CheckYorAnswers,
      LinkStatus.COMPLETED,
      ET3ModificationTypes.MODIFICATION_TYPE_SUBMIT
    );
    if (!userCase || req.body.saveAsDraft) {
      return res.redirect(setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_ET3));
    }
    if (req.body?.submit) {
      return res.redirect(setUrlLanguage(req, PageUrls.APPLICATION_SUBMITTED));
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_ET3);
    const userCase = req.session.userCase;

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
      et3ResponseSection1: getEt3Section1(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection3: getEt3Section3(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection4: getEt3Section4(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      et3ResponseSection6: getEt3Section6(userCase, sectionTranslations, InterceptPaths.ANSWERS_CHANGE),
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
      form: this.checkYourAnswers,
    });
  };
}
