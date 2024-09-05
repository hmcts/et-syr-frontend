import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      respondentName: {
        classes: 'govuk-radios',
        id: 'respondentName',
        type: 'radios',
        label: (l: AnyRecord): string => l.label1,
        labelHidden: false,
        values: [
          {
            name: 'respondentName',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentName',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
            subFields: {
              respondentNameDetail: {
                id: 'respondentNameTxt',
                name: 'respondentNameTxt',
                type: 'text',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.respondentNameTextLabel,
                classes: 'govuk-text',
                attributes: { maxLength: 100 },
                validator: isFieldFilledIn,
              },
            },
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.TYPE_OF_ORGANISATION);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    const respondentNameContentForm = this.respondentNameContent;
    const userCase = req.session.userCase;

    const respondentNameQuestion = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    respondentNameQuestion.label = (l: AnyRecord): string =>
      l.label1 + userCase.respondents[0].respondentName + l.label2;

    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_NAME as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      form: respondentNameContentForm,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}