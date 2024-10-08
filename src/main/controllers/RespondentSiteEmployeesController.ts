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

const logger = getLogger('RespondentSiteEmployeesController');

export default class RespondentSiteEmployeesController {
  private readonly form: Form;
  private readonly respondentSiteEmployees: FormContent = {
    fields: {
      respondentSiteEmployees: {
        classes: 'govuk-text',
        id: 'respondentSiteEmployees',
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
    this.form = new Form(<FormFields>this.respondentSiteEmployees.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SITE_EMPLOYEES);
    const content = getPageContent(req, this.respondentSiteEmployees, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SITE_EMPLOYEES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_SITE_EMPLOYEES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
