import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isAValidNumber } from '../validators/validator';

export default class RespondentEmployeesController {
  private readonly form: Form;
  private readonly respondentEmployees: FormContent = {
    fields: {
      et3ResponseEmploymentCount: {
        classes: 'govuk-text',
        id: 'respondentEmployees',
        type: 'text',
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: false,
        validator: isAValidNumber,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentEmployees.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_SITES
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_EMPLOYEES);
    const content = getPageContent(req, this.respondentEmployees, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_EMPLOYEES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_EMPLOYEES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
