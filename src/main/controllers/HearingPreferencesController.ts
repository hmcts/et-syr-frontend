import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HearingPreferenceET3 } from '../definitions/case';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import ET3Util from '../utils/ET3Util';

export default class HearingPreferencesController {
  private readonly form: Form;
  private readonly hearingPreferences: FormContent = {
    fields: {
      et3ResponseHearingRespondent: {
        id: 'hearingPreferences',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'm',
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
    const eraOctober2026Enabled = await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null);
    const redirectUrl = eraOctober2026Enabled ? PageUrls.HEARING_PANEL_PREFERENCE : PageUrls.REASONABLE_ADJUSTMENTS;
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      redirectUrl
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
