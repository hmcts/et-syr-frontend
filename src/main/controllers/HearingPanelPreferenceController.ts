import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLessAndNotEmpty, isFieldFilledIn } from '../validators/validator';

export default class HearingPanelPreferenceController {
  private readonly form: Form;
  private readonly hearingPanelPreference: FormContent = {
    fields: {
      respondentHearingPanelPreference: {
        classes: 'govuk-radios',
        id: 'respondentHearingPanelPreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        validator: isFieldFilledIn,
        values: [
          {
            name: 'respondentHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioNoPreference,
            value: 'No preference',
          },
          {
            name: 'respondentHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioJudge,
            value: 'Judge',
            subFields: {
              respondentHearingPanelPreferenceReason: {
                id: 'respondentHearingPanelPreferenceReason',
                name: 'respondentHearingPanelPreferenceReason',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.reasonLabel,
                classes: 'govuk-text',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
          {
            name: 'respondentHearingPanelPreference',
            label: (l: AnyRecord): string => l.radioPanel,
            value: 'Panel',
            subFields: {
              respondentHearingPanelPreferenceReason: {
                id: 'respondentHearingPanelPreferenceReason-panel',
                name: 'respondentHearingPanelPreferenceReason',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.reasonLabel,
                classes: 'govuk-text',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.HEARING_PANEL_PREFERENCE,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.hearingPanelPreference.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (!(await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null))) {
      res.redirect(PageUrls.REASONABLE_ADJUSTMENTS);
      return;
    }
    if (Array.isArray(req.body.respondentHearingPanelPreferenceReason)) {
      req.body.respondentHearingPanelPreferenceReason =
        req.body.respondentHearingPanelPreferenceReason.find((val: string) => val && val.trim().length > 0) ||
        undefined;
    }
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];

    if (
      formData.respondentHearingPanelPreference !== 'Judge' &&
      formData.respondentHearingPanelPreference !== 'Panel'
    ) {
      fieldsToReset.push('respondentHearingPanelPreferenceReason');
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.REASONABLE_ADJUSTMENTS,
      fieldsToReset
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!(await getFlagValue(FEATURE_FLAGS.ERA_OCTOBER_2026, null))) {
      res.redirect(PageUrls.REASONABLE_ADJUSTMENTS);
      return;
    }
    const redirectUrl = setUrlLanguage(req, PageUrls.HEARING_PANEL_PREFERENCE);

    if (isClearSelection(req)) {
      req.session.userCase.respondentHearingPanelPreference = undefined;
    }

    const content = getPageContent(req, this.hearingPanelPreference, [
      TranslationKeys.COMMON,
      TranslationKeys.HEARING_PANEL_PREFERENCE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.HEARING_PANEL_PREFERENCE, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
