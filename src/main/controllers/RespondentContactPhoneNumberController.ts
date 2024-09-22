import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import { isPhoneNumberValid } from '../validators/validator';

const logger = getLogger('RespondentContactPhoneNumberController');

export default class RespondentContactPhoneNumberController {
  private readonly form: Form;
  private readonly respondentContactPhoneNumber: FormContent = {
    fields: {
      respondentContactPhoneNumber: {
        id: 'respondentContactPhoneNumber',
        name: 'respondentContactPhoneNumber',
        type: 'text',
        hint: (l: AnyRecord): string => l.respondentContactPhoneNumber,
        classes: 'govuk-text',
        attributes: { maxLength: 20 },
        validator: isPhoneNumberValid,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentContactPhoneNumber.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_CONTACT_PREFERENCES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);

    const content = getPageContent(req, this.respondentContactPhoneNumber, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
