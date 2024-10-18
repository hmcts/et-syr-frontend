import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantPayDetailsController');

export default class ClaimantPayDetailsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      arePayDetailsGivenCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.arePayDetailsGivenCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            hint: (l: AnyRecord): string => l.arePayDetailsGivenCorrect.no.hint,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
            hint: (l: AnyRecord): string => l.arePayDetailsGivenCorrect.notSure.hint,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.arePayDetailsGivenCorrect === YesOrNoOrNotApplicable.NO) {
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
