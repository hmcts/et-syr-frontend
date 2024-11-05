import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getEt3Section2 } from '../helpers/controller/CheckYourAnswersET3Helper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

export default class CheckYourAnswersHearingPreferencesController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      hearingPreferencesSection: {
        classes: 'govuk-radios',
        id: 'hearingPreferencesSection',
        type: 'radios',
        label: (l: AnyRecord): string => l.cya.label,
        hint: (l: AnyRecord): string => l.cya.hint,
        labelHidden: false,
        values: [
          {
            name: 'hearingPreferencesSection',
            label: (l: AnyRecord): string => l.cya.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'hearingPreferencesSection',
            label: (l: AnyRecord): string => l.cya.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const linkStatus = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? LinkStatus.COMPLETED
      : LinkStatus.IN_PROGRESS;

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      linkStatus,
      PageUrls.RESPONDENT_RESPONSE_TASK_LIST
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      sessionErrors: req.session.errors,
      form: this.formContent,
      et3ResponseSection2: getEt3Section2(userCase, sectionTranslations, InterceptPaths.EMPLOYER_DETAILS_CHANGE),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
