import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { FormFieldNames, LoggerConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import ET3Util from '../utils/ET3Util';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentNameController');

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
      hiddenErrorField: {
        id: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        type: 'text',
        hidden: true,
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
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(req.url);
    }
    req.session.selectedRespondent.responseRespondentNameQuestion =
      formData.respondentName === 'Yes' ? YesOrNo.YES : YesOrNo.NO;
    req.session.selectedRespondent.responseRespondentName = formData.respondentName;
    const userCase: CaseWithId = await ET3Util.updateET3Data(req);
    if (req.session.errors?.length > 0) {
      logger.error(LoggerConstants.ERROR_API);
      return res.redirect(req.url);
    } else {
      req.session.userCase = userCase;
      res.redirect(PageUrls.TYPE_OF_ORGANISATION);
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    const userCase = req.session.userCase;

    const respondentNameQuestion = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    respondentNameQuestion.label = (l: AnyRecord): string =>
      l.label1 + userCase.respondents[0].respondentName + l.label2;

    const content = getPageContent(req, this.respondentNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_NAME,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
