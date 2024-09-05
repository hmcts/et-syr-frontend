import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreference } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { atLeastOneFieldIsChecked, isFieldFilledIn } from '../validators/validator';

export default class HearingPreferencesController {
  private readonly form: Form;
  private readonly hearingPreferences: FormContent = {
    fields: {
      hearingPreferences: {
        id: 'hearingPreferences',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'hearingPreferences',
            label: l => l.checkboxVideo,
            value: HearingPreference.VIDEO,
          },
          {
            name: 'hearingPreferences',
            label: l => l.checkboxPhone,
            value: HearingPreference.PHONE,
          },
          {
            divider: true,
          },
          {
            name: 'hearingPreferences',
            label: l => l.checkboxNeither,
            exclusive: true,
            value: HearingPreference.NEITHER,
            subFields: {
              hearingAssistance: {
                id: 'hearingAssistance',
                type: 'textarea',
                label: l => l.explain,
                labelSize: 'normal',
                attributes: {
                  maxLength: 2500,
                },
                validator: isFieldFilledIn,
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.hearingPreferences.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.NOT_IMPLEMENTED);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.HEARING_PREFERENCES);
    const userCase = req.session?.userCase;
    const hearingPreferencesForm = this.hearingPreferences;

    res.render(TranslationKeys.HEARING_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.HEARING_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      userCase,
      form: hearingPreferencesForm,
      sessionErrors: req.session.errors,
    });
  };
}
