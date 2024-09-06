import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isFieldFilledIn } from '../validators/validator';

export default class RespondentEnterAddressController {
  private readonly form: Form;
  private readonly respondentEnterAddressContent: FormContent = {
    fields: {
      addressLine1: {
        id: 'addressLine1',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine1,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      addressLine2: {
        id: 'addressLine2',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine2,
        classes: 'govuk-label govuk-!-width-one-half',
      },
      townOrCity: {
        id: 'townOrCity',
        type: 'text',
        label: (l: AnyRecord): string => l.townOrCity,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      country: {
        id: 'country',
        type: 'text',
        label: (l: AnyRecord): string => l.country,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      postcodeOrAreaCode: {
        id: 'postcodeOrAreaCode',
        type: 'text',
        label: (l: AnyRecord): string => l.postcodeOrAreaCode,
        classes: 'govuk-label govuk-!-width-one-half',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentEnterAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_ADDRESS);
    const respondentEnterAddressContent = this.respondentEnterAddressContent;
    const userCase = req.session.userCase;

    res.render(TranslationKeys.RESPONDENT_ENTER_ADDRESS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ENTER_ADDRESS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentEnterAddressContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      sessionErrors: req.session.errors,
    });
  };
}
