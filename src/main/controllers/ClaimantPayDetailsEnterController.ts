import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PayFrequency } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isValidCurrency } from '../validators/validator';

export default class ClaimantPayDetailsEnterController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponsePayFrequency: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponsePayFrequency.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayFrequency.hintLabel,
        values: [
          {
            label: (l: AnyRecord): string => l.weekly,
            value: PayFrequency.WEEKLY,
          },
          {
            label: (l: AnyRecord): string => l.monthly,
            value: PayFrequency.MONTHLY,
          },
          {
            label: (l: AnyRecord): string => l.annually,
            value: PayFrequency.ANNUALLY,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
      },
      et3ResponsePayBeforeTax: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.et3ResponsePayBeforeTax.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayBeforeTax.hintLabel,
        attributes: {
          maxLength: 16,
        },
        validator: isValidCurrency,
      },
      et3ResponsePayTakehome: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.et3ResponsePayTakehome.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayTakehome.hintLabel,
        attributes: {
          maxLength: 16,
        },
        validator: isValidCurrency,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_NOTICE_PERIOD
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponsePayFrequency = undefined;
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_PAY_DETAILS_ENTER, {
      ...content,
      hideContactUs: true,
    });
  };
}
