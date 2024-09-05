import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect, getLanguageParam } from '../helpers/RouterHelpers';
import { isOptionSelected } from '../validators/validator';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddress: {
        classes: 'govuk-radios--inline',
        id: 'respondentAddress',
        type: 'radios',
        label: (l: AnyRecord): string => l.correctAddressQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentAddress',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentAddress',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);

    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      return res.redirect(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      return res.redirect(PageUrls.RESPONDENT_ENTER_POST_CODE);
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ADDRESS);
    const respondentAddressContent = this.respondentAddressContent;
    const userCase = req.session.userCase;

    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ADDRESS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      form: respondentAddressContent,
      userCase,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      sessionErrors: req.session.errors,
    });
  };
}
