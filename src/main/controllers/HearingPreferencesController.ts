import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreference } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { atLeastOneFieldIsChecked, isContent2500CharsOrLessOrEmpty } from '../validators/validator';

export default class HearingPreferencesController {
  private readonly form: Form;
  private readonly hearingPreferences: FormContent = {
    fields: {
      hearingPreference: {
        id: 'hearingPreference',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        values: [
          {
            name: 'hearingPreference',
            label: l => l.checkboxVideo,
            value: HearingPreference.VIDEO,
          },
          {
            name: 'hearingPreference',
            label: l => l.checkboxPhone,
            value: HearingPreference.PHONE,
          },
          {
            divider: true,
          },
          {
            name: 'hearingPreference',
            label: l => l.checkboxNeither,
            exclusive: true,
            value: HearingPreference.NEITHER,
            subFields: {
              hearingAssistance: {
                id: 'hearingAssistance',
                name: 'hearingAssistance',
                type: 'textarea',
                label: l => l.explain,
                labelSize: 'normal',
                validator: isContent2500CharsOrLessOrEmpty,
              },
            },
          },
        ],
        validator: atLeastOneFieldIsChecked,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.hearingPreferences.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // todo: field reset needed here for the hearing preference detail
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.REASONABLE_ADJUSTMENTS
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.HEARING_PREFERENCES);
    const content = getPageContent(req, this.hearingPreferences, [
      TranslationKeys.COMMON,
      TranslationKeys.HEARING_PREFERENCES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.HEARING_PREFERENCES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
