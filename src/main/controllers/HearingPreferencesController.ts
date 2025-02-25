import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreferenceET3 } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';

export default class HearingPreferencesController {
  private readonly form: Form;
  private readonly hearingPreferences: FormContent = {
    fields: {
      et3ResponseHearingRespondent: {
        id: 'hearingPreferences',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        values: [
          {
            name: 'et3ResponseHearingRespondent',
            label: l => l.checkboxVideo,
            value: HearingPreferenceET3.VIDEO,
          },
          {
            name: 'et3ResponseHearingRespondent',
            label: l => l.checkboxPhone,
            value: HearingPreferenceET3.PHONE,
          },
        ],
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.hearingPreferences.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
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
