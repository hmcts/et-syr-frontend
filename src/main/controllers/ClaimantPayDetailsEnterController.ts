import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { HowOften } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantPayDetailsEnterController');

export default class ClaimantPayDetailsEnterController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      howOftenClaimantPaid: {
        type: 'radios',
        label: (l: AnyRecord): string => l.howOftenClaimantPaid.label,
        hint: (l: AnyRecord): string => l.howOftenClaimantPaid.hintLabel,
        values: [
          {
            label: (l: AnyRecord): string => l.weekly,
            value: HowOften.WEEKLY,
          },
          {
            label: (l: AnyRecord): string => l.monthly,
            value: HowOften.MONTHLY,
          },
          {
            label: (l: AnyRecord): string => l.annually,
            value: HowOften.ANNUALLY,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: HowOften.NOT_SURE,
          },
        ],
        validator: isOptionSelected,
      },
      claimantPayBeforeTax: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.claimantPayBeforeTax.label,
        hint: (l: AnyRecord): string => l.claimantPayBeforeTax.hintLabel,
        attributes: {
          maxLength: 16,
        },
      },
      claimantNormalTakeHomePay: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.claimantNormalTakeHomePay.label,
        hint: (l: AnyRecord): string => l.claimantNormalTakeHomePay.hintLabel,
        attributes: {
          maxLength: 16,
        },
      },
      furtherInfoAboutClaimantPayDetails: {
        type: 'textarea',
        id: 'whyDoYouDisagreeAcas',
        label: (l: AnyRecord): string => l.furtherInfoAboutClaimantPayDetails.label,
        attributes: {
          maxLength: 2500,
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NOTICE_PERIOD);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER, {
      ...content,
      periodPay: '[Weekly / Monthly / Annual / Not provided]', // TODO: Update value
      payBeforeTax: '[Pay BEFORE tax and National Insurance / Not provided]', // TODO: Update value
      payAfterTax: '[Pay AFTER tax and National Insurance / Not provided]', // TODO: Update value
      hideContactUs: true,
    });
  };
}
