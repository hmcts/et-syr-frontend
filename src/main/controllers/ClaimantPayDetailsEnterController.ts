import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, PayFrequency } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { endSubSectionReturnNextPage } from '../helpers/RouterHelpers';
import { isValidCurrency } from '../validators/currency-validator';

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
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;

    const formData: Partial<CaseWithId> = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    userCase.et3ResponsePayFrequency = formData.et3ResponsePayFrequency;

    req.session.errors = [];
    const validatorErrors = this.form.getValidatorErrors(formData);
    if (validatorErrors.length > 0) {
      const hasBeforeTaxError = validatorErrors.some(err => err.propertyName === 'et3ResponsePayBeforeTax');
      if (!hasBeforeTaxError) {
        userCase.et3ResponsePayBeforeTax = formData.et3ResponsePayBeforeTax;
      }
      const hasTakehomeError = validatorErrors.some(err => err.propertyName === 'et3ResponsePayTakehome');
      if (!hasTakehomeError) {
        userCase.et3ResponsePayTakehome = formData.et3ResponsePayTakehome;
      }
      req.session.errors.push(...validatorErrors);
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER));
    }

    userCase.et3ResponsePayBeforeTax = formData.et3ResponsePayBeforeTax;
    userCase.et3ResponsePayTakehome = formData.et3ResponsePayTakehome;

    return res.redirect(endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD));
  };

  public get = (req: AppRequest, res: Response): void => {
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
