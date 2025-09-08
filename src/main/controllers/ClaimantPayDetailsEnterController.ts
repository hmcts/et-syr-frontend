import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, PayFrequency } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { CurrencyField } from '../definitions/currency';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { applyFormDataToUserCase, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { endSubSectionReturnNextPage, isClearSelection, returnValidUrl } from '../helpers/RouterHelpers';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import ObjectUtils from '../utils/ObjectUtils';

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
        ...CurrencyField,
        id: 'et3ResponsePayBeforeTax',
        label: (l: AnyRecord): string => l.et3ResponsePayBeforeTax.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayBeforeTax.hintLabel,
      },
      et3ResponsePayTakehome: {
        ...CurrencyField,
        id: 'et3ResponsePayTakehome',
        label: (l: AnyRecord): string => l.et3ResponsePayTakehome.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayTakehome.hintLabel,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.errors = [];
    const formData: Partial<CaseWithId> = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    applyFormDataToUserCase(req, this.form, [
      'et3ResponsePayBeforeTax',
      'et3ResponsePayTakehome',
      'et3ResponsePayFrequency',
    ]);
    if (CollectionUtils.isNotEmpty(req.session.errors)) {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER)));
    }
    const userCase: CaseWithId = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS
    );
    if (ObjectUtils.isEmpty(userCase)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.CASE_UPDATE_BACKEND_ERROR,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER)));
    }
    req.session.userCase = userCase;
    return res.redirect(returnValidUrl(endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
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
