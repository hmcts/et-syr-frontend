import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, PayFrequency } from '../definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { endSubSectionReturnNextPage, isClearSelection } from '../helpers/RouterHelpers';
import {
  convertToDatabaseValue,
  convertToInputValue,
  getDisplayValue,
} from '../helpers/controller/ClaimantPayDetailsEnterHelper';
import ET3Util from '../utils/ET3Util';
import ObjectUtils from '../utils/ObjectUtils';
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
      et3ResponsePayBeforeTaxInput: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.et3ResponsePayBeforeTaxInput.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayBeforeTaxInput.hintLabel,
        attributes: {
          maxLength: 13,
        },
        validator: isValidCurrency,
      },
      et3ResponsePayTakeHomeInput: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.et3ResponsePayTakeHomeInput.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayTakeHomeInput.hintLabel,
        attributes: {
          maxLength: 13,
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // Store the raw user input values
    const formData: Partial<CaseWithId> = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.userCase.et3ResponsePayFrequency = formData.et3ResponsePayFrequency;
    req.session.userCase.et3ResponsePayBeforeTaxInput = formData.et3ResponsePayBeforeTaxInput;
    req.session.userCase.et3ResponsePayTakeHomeInput = formData.et3ResponsePayTakeHomeInput;

    // Validate the form data and redirect back to the form with errors
    req.session.errors = [];
    const validatorErrors = this.form.getValidatorErrors(formData);
    if (validatorErrors.length > 0) {
      req.session.errors.push(...validatorErrors);
      return res.redirect(setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER));
    }

    // Convert input values to database values for storage
    req.session.userCase.et3ResponsePayBeforeTax = convertToDatabaseValue(formData.et3ResponsePayBeforeTaxInput);
    req.session.userCase.et3ResponsePayTakehome = convertToDatabaseValue(formData.et3ResponsePayTakeHomeInput);

    // Save the data with API and update the session
    const userCase: CaseWithId = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS
    );
    if (ObjectUtils.isEmpty(userCase)) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    req.session.userCase = userCase;

    // Convert stored values back to input values for display
    req.session.userCase.et3ResponsePayBeforeTaxInput = convertToInputValue(
      req.session.userCase.et3ResponsePayBeforeTax
    );
    req.session.userCase.et3ResponsePayTakeHomeInput = convertToInputValue(req.session.userCase.et3ResponsePayTakehome);

    // Redirect to the next page
    return res.redirect(endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD));
  };

  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;

    // Clear selection if the user clicks on clear selection link
    if (isClearSelection(req)) {
      userCase.et3ResponsePayFrequency = undefined;
    }

    // Convert stored values back to input values for display
    userCase.et3ResponsePayBeforeTaxInput = getDisplayValue(
      userCase.et3ResponsePayBeforeTax,
      userCase.et3ResponsePayBeforeTaxInput
    );
    userCase.et3ResponsePayTakeHomeInput = getDisplayValue(
      userCase.et3ResponsePayTakehome,
      userCase.et3ResponsePayTakeHomeInput
    );

    // Get the content for the page and render it
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
