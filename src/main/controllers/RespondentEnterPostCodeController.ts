import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isValidUKPostcode } from '../validators/address_validator';

export default class RespondentEnterPostCodeController {
  private readonly form: Form;
  private readonly respondentEnterPostCodeContent: FormContent = {
    fields: {
      respondentEnterPostcode: {
        id: 'respondentEnterPostcode',
        type: 'text',
        label: (l: AnyRecord): string => l.enterPostcode,
        classes: 'govuk-label govuk-!-width-one-half',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
        validator: isValidUKPostcode,
      },
    },
    submit: {
      type: submitButton,
      text: (l: AnyRecord): string => l.findAddress,
    },
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentEnterPostCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_SELECT_POST_CODE);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_POST_CODE);
    const respondentEnterPostCodeContent = this.respondentEnterPostCodeContent;
    const userCase = req.session.userCase;

    res.render(TranslationKeys.RESPONDENT_ENTER_POST_CODE, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ENTER_POST_CODE as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentEnterPostCodeContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      sessionErrors: req.session.errors,
    });
  };
}
