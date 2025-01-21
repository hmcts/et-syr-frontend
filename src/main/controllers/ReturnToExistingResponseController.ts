import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { FormFieldNames, LegacyUrls, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { conditionalRedirect, getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import ErrorUtils from '../utils/ErrorUtils';
import StringUtils from '../utils/StringUtils';
import { isFieldFilledIn } from '../validators/validator';

export default class ReturnToExistingResponseController {
  private readonly form: Form;
  private readonly returnToExistingContent: FormContent = {
    fields: {
      returnToExisting: {
        id: 'return_number_or_account',
        type: 'radios',
        classes: 'govuk-date-input',
        label: (l: AnyRecord): string => l.p2,
        labelHidden: true,
        values: [
          {
            name: 'have_return_number',
            label: (l: AnyRecord): string => l.optionText1,
            value: YesOrNo.YES,
            selected: false,
          },
          {
            name: 'have_account',
            label: (l: AnyRecord): string => l.optionText2,
            value: YesOrNo.NO,
            selected: false,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.returnToExistingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    if (StringUtils.isBlank(req?.body?.returnToExisting)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.REQUIRED,
        FormFieldNames.RETURN_TO_EXISTING.RETURN_TO_EXISTING_RADIOBUTTON
      );
      return res.redirect(returnValidUrl(PageUrls.RETURN_TO_EXISTING_RESPONSE + getLanguageParam(req.url)));
    }
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? LegacyUrls.SIGN_IN
      : PageUrls.CASE_LIST + getLanguageParam(req.url);
    res.redirect(returnValidUrl(redirectUrl));
  };

  public get = (req: AppRequest, res: Response): void => {
    req.session.guid = undefined;
    const content = getPageContent(req, this.returnToExistingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RETURN_TO_EXISTING_RESPONSE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RETURN_TO_EXISTING_RESPONSE, {
      ...content,
      respondNewClaimUrl: PageUrls.CASE_NUMBER_CHECK + getLanguageParam(req.url),
    });
  };
}
