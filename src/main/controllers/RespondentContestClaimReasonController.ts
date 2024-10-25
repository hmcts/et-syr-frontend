import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

export default class RespondentContestClaimReasonController {
  private readonly form: Form;
  private readonly respondentContestClaimReason: FormContent = {
    fields: {
      et3ResponseContestClaimDetails: {
        classes: 'govuk-textarea',
        id: 'et3ResponseContestClaimDetails',
        type: 'charactercount',
        label: (l: AnyRecord): string => l.textAreaLabel,
        labelHidden: false,
        maxlength: 2500,
        validator: isContentCharsOrLessAndNotEmpty(2500),
      },
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: l => l.files.title,
        type: 'insetFields',
        subFields: {
          et3ResponseContestClaimDocument: {
            id: 'et3ResponseContestClaimDocument',
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM
    );
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
