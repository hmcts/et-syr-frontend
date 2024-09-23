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

const logger = getLogger('RespondentEmployeesController');

export default class RespondentEmployeesController {
  private readonly form: Form;
  private readonly respondentEmployees: FormContent = {
    fields: {
      respondentEmployees: {
        classes: 'govuk-text',
        id: 'respondentEmployees',
        type: 'text',
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: false,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentEmployees.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_SITES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_EMPLOYEES);
    const content = getPageContent(req, this.respondentEmployees, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_EMPLOYEES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_EMPLOYEES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
