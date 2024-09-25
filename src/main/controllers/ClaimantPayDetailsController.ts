import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { YesNoNotSureRadio, saveForLaterButton, submitButton } from '../definitions/radios';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';

const logger = getLogger('ClaimantPayDetailsController');

export default class ClaimantPayDetailsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      arePayDetailsGivenCorrect: YesNoNotSureRadio,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.arePayDetailsGivenCorrect === YesOrNoOrNotSure.NO) {
      await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_PAY_DETAILS_ENTER);
    } else {
      await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NOTICE_PERIOD);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PAY_DETAILS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_PAY_DETAILS, {
      ...content,
      periodPay: '[Weekly / Monthly / Annual / Not provided]', // TODO: Update value
      payBeforeTax: '[Pay BEFORE tax and National Insurance / Not provided]', // TODO: Update value
      payAfterTax: '[Pay AFTER tax and National Insurance / Not provided]', // TODO: Update value
      hideContactUs: true,
    });
  };
}
