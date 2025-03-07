import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, HearingPanelPreference, RespondentET3Model } from '../definitions/case';
import { PageUrls, ParameterizedUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';
import ObjectUtils from '../utils/ObjectUtils';
import RespondentUtils from '../utils/RespondentUtils';
import StringUtils from '../utils/StringUtils';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

export default class RespondentHearingPanelPreferenceController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      respondentHearingPanelPreference: {
        type: 'radios',
        label: (l: AnyRecord): string => l.respondentHearingPanelPreference.question,
        values: [
          {
            label: (l: AnyRecord): string => l.respondentHearingPanelPreference.noPreference,
            value: HearingPanelPreference.NO_PREFERENCE,
          },
          {
            label: (l: AnyRecord): string => l.respondentHearingPanelPreference.judge,
            value: HearingPanelPreference.JUDGE,
            subFields: {
              respondentHearingPanelPreferenceReasonJudge: {
                id: 'respondentHearingPanelPreferenceReasonJudge',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.respondentHearingPanelPreference.judgeReason,
                labelSize: 's',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.respondentHearingPanelPreference.panel,
            value: HearingPanelPreference.PANEL,
            subFields: {
              respondentHearingPanelPreferenceReasonPanel: {
                id: 'respondentHearingPanelPreferenceReasonPanelReasonPanel',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.respondentHearingPanelPreference.panelReason,
                labelSize: 's',
                maxlength: 500,
                validator: isContentCharsOrLessAndNotEmpty(500),
              },
            },
          },
        ],
      },
      clearSelection: {
        type: 'clearSelectionParameterized',
        targetUrl: '/' + ParameterizedUrls.CLEAR_SELECTION + '/' + TranslationKeys.RESPONDENT_HEARING_PANEL_PREFERENCE,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];
    if (ObjectUtils.isNotEmpty(req?.session?.userCase)) {
      if (
        StringUtils.isBlank(formData.respondentHearingPanelPreference) ||
        HearingPanelPreference.NO_PREFERENCE === formData.respondentHearingPanelPreference
      ) {
        fieldsToReset.push('respondentHearingPanelPreferenceReasonJudge');
        fieldsToReset.push('respondentHearingPanelPreferenceReasonPanel');
      }
      if (HearingPanelPreference.JUDGE === formData.respondentHearingPanelPreference) {
        fieldsToReset.push('respondentHearingPanelPreferenceReasonPanel');
      }
      if (HearingPanelPreference.PANEL === formData.respondentHearingPanelPreference) {
        fieldsToReset.push('respondentHearingPanelPreferenceReasonJudge');
      }
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

  public get = (req: AppRequest, res: Response): void => {
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_HEARING_PANEL_PREFERENCE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_HEARING_PANEL_PREFERENCE, {
      ...content,
      hideContactUs: true,
      selectedRespondent,
    });
  };
}
