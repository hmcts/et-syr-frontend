import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { YesNoNotSureRadio, saveForLaterButton, submitButton } from '../definitions/radios';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';

const logger = getLogger('IsClaimantEmploymentWithRespondentContinuingController');

export default class IsClaimantEmploymentWithRespondentContinuingController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      isEmploymentContinuing: YesNoNotSureRadio,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_JOB_TITLE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING, {
      ...content,
      hideContactUs: true,
    });
  };
}
