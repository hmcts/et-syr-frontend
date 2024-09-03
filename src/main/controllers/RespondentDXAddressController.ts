import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class RespondentDXAddressController {
  private readonly form: Form;
  private readonly respondentDxAddressContent: FormContent = {
    fields: {
      respondentDxAddress: {
        id: 'respondentDxAddress',
        name: 'respondentDxAddress',
        type: 'text',
        hint: (l: AnyRecord): string => l.respondentDxAddress,
        classes: 'govuk-text',
        attributes: { maxLength: 100 },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentDxAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_DX_ADDRESS);
    const respondentDxAddressContent = this.respondentDxAddressContent;

    res.render(TranslationKeys.RESPONDENT_DX_ADDRESS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_DX_ADDRESS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      form: respondentDxAddressContent,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}
