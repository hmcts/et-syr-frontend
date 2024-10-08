import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import { isFieldFilledIn } from '../validators/validator';

const logger = getLogger('RespondentContestClaimReasonController');

export default class RespondentContestClaimReasonController {
  private readonly form: Form;
  private readonly respondentContestClaimReason: FormContent = {
    fields: {
      respondentContestClaimReason: {
        classes: 'govuk-textarea',
        id: 'respondentContestClaimReason',
        type: 'textarea',
        label: (l: AnyRecord): string => l.textAreaLabel,
        labelHidden: false,
        validator: isFieldFilledIn,
      },
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: l => l.files.title,
        type: 'insetFields',
        subFields: {
          supportingMaterialFile: {
            id: 'supportingMaterialFile',
            classes: 'govuk-label',
            labelHidden: false,
            labelSize: 'm',
            type: 'upload',
          },
          upload: {
            label: (l: AnyRecord): string => l.files.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            type: 'button',
            name: 'upload',
            value: 'true',
          },
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentContestClaimReason.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    const userCase = req.session.userCase;

    const textAreaLabel = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    textAreaLabel.label = (l: AnyRecord): string =>
      l.textAreaLabel1 + userCase.respondents[0].respondentName + l.textAreaLabel2;

    const content = getPageContent(req, this.respondentContestClaimReason, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
