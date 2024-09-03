import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isPhoneNumberValid } from '../validators/validator';

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
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_CONTACT_PREFERENCES);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
    const respondentContactPhoneNumber = this.respondentContactPhoneNumber;

    res.render(TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      form: respondentContactPhoneNumber,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}
