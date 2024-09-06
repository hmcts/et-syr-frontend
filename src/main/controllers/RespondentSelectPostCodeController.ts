import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isOptionSelected } from '../validators/validator';

export default class RespondentSelectPostCodeController {
  private readonly form: Form;
  // NOTE: text, will need to be changed to option when addresses are loaded based on postcode
  private readonly respondentSelectPostCodeContent: FormContent = {
    fields: {
      addressEnterPostcode: {
        type: 'text',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.selectAddress,
        id: 'addressAddressTypes',
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentSelectPostCodeContent.fields);
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
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SELECT_POST_CODE);
    const respondentSelectPostCodeContent = this.respondentSelectPostCodeContent;
    const userCase = req.session.userCase;

    res.render(TranslationKeys.RESPONDENT_SELECT_POST_CODE, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_SELECT_POST_CODE as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentSelectPostCodeContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      sessionErrors: req.session.errors,
    });
  };
}
