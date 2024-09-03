import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isNameValid } from '../validators/validator';

export default class RespondentPreferredContactNameController {
  private readonly form: Form;
  private readonly respondentPreferredContactNameContent: FormContent = {
    fields: {
      respondentPreferredContactName: {
        id: 'respondentPreferredContactName',
        name: 'respondentPreferredContactName',
        type: 'text',
        hint: (l: AnyRecord): string => l.respondentPreferredContactName,
        classes: 'govuk-text',
        attributes: { maxLength: 100 },
        validator: isNameValid,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentPreferredContactNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_DX_ADDRESS);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    const respondentPreferredContactNameContent = this.respondentPreferredContactNameContent;

    res.render(TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      form: respondentPreferredContactNameContent,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}
