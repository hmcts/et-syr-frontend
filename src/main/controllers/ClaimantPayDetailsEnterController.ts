import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, PayFrequency } from '../definitions/case';
import { DefaultValues, FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection, returnValidUrl } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import NumberUtils from '../utils/NumberUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';
import { isValidCurrency } from '../validators/currency-validator';

const logger = getLogger('ClaimantPayDetailsEnterController');

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
          maxLength: 13,
        },
        validator: isValidCurrency,
      },
      et3ResponsePayTakehome: {
        type: 'currency',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord): string => l.et3ResponsePayTakehome.label,
        hint: (l: AnyRecord): string => l.et3ResponsePayTakehome.hintLabel,
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
    req.session.errors = [];
    const formData: Partial<CaseWithId> = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const et3ResponsePayBeforeTax: number = NumberUtils.convertStringToNumber(formData.et3ResponsePayBeforeTax);
    const et3ResponsePayTakeHome: number = NumberUtils.convertStringToNumber(formData.et3ResponsePayTakehome);
    if (NumberUtils.isNotEmpty(et3ResponsePayBeforeTax)) {
      req.session.userCase.et3ResponsePayBeforeTax = String((et3ResponsePayBeforeTax * 100).toFixed(0));
    } else {
      req.session.userCase.et3ResponsePayBeforeTax = DefaultValues.STRING_EMPTY;
    }
    if (NumberUtils.isNotEmpty(et3ResponsePayTakeHome)) {
      req.session.userCase.et3ResponsePayTakehome = String((et3ResponsePayTakeHome * 100).toFixed(0));
    } else {
      req.session.userCase.et3ResponsePayTakehome = DefaultValues.STRING_EMPTY;
    }
    if (StringUtils.isNotBlank(formData.et3ResponsePayFrequency)) {
      req.session.userCase.et3ResponsePayFrequency = formData.et3ResponsePayFrequency;
    }
    const userCase: CaseWithId = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS
    );
    if (CollectionUtils.isEmpty(req.session.errors) && ObjectUtils.isNotEmpty(userCase)) {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CLAIMANT_NOTICE_PERIOD)));
    }
    if (ObjectUtils.isEmpty(userCase)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.FILE_UPLOAD_BACKEND_ERROR,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
    }
    req.session.userCase = userCase;
    return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    let userCase = undefined;
    try {
      userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req?.session?.userCase?.id)).data,
        req
      );
    } catch (error) {
      logger.error('Unable to retrieve user info from get user api. Error is: ' + error.message);
    }
    if (ObjectUtils.isNotEmpty(userCase)) {
      req.session.userCase = userCase;
    }
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponsePayFrequency = undefined;
    }
    if (NumberUtils.isNumericValue(req?.session?.userCase?.et3ResponsePayBeforeTax)) {
      req.session.userCase.et3ResponsePayBeforeTax = String(
        NumberUtils.convertStringToNumber(req.session.userCase.et3ResponsePayBeforeTax) / 100
      );
    }
    if (NumberUtils.isNumericValue(req?.session?.userCase?.et3ResponsePayTakehome)) {
      req.session.userCase.et3ResponsePayTakehome = String(
        NumberUtils.convertStringToNumber(req.session.userCase.et3ResponsePayTakehome) / 100
      );
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
