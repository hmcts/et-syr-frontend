import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreference } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import { atLeastOneFieldIsChecked, isFieldFilledIn } from '../validators/validator';

const logger = getLogger('HearingPreferencesController');

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
    await postLogic(req, res, this.form, logger, PageUrls.REASONABLE_ADJUSTMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.HEARING_PREFERENCES);
    const content = getPageContent(req, this.hearingPreferences, [
      TranslationKeys.COMMON,
      TranslationKeys.HEARING_PREFERENCES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.HEARING_PREFERENCES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
