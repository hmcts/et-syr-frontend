import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { LoggerConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { returnValidUrl } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { isValidUKPostcode } from '../validators/address_validator';

const logger = getLogger('RespondentEnterPostCodeController');

export default class RespondentEnterPostCodeController {
  private readonly form: Form;
  private readonly respondentEnterPostCodeContent: FormContent = {
    fields: {
      responseRespondentAddressPostCode: {
        id: 'responseRespondentAddressPostCode',
        name: 'responseRespondentAddressPostCode',
        type: 'text',
        label: (l: AnyRecord): string => l.enterPostcode,
        classes: 'govuk-label govuk-!-width-one-half',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
        validator: isValidUKPostcode,
      },
    },
    submit: {
      type: submitButton,
      text: (l: AnyRecord): string => l.findAddress,
    },
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentEnterPostCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      logger.error(LoggerConstants.ERROR_FORM_INVALID_DATA + 'CaseId: ' + req.session?.userCase?.id);
      const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_POST_CODE);
      return res.redirect(redirectUrl);
    }
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SELECT_POST_CODE);
    req.session.userCase.responseRespondentAddressPostCode = formData.responseRespondentAddressPostCode;
    return res.redirect(returnValidUrl(redirectUrl));
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_POST_CODE);
    const content = getPageContent(req, this.respondentEnterPostCodeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ENTER_POST_CODE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ENTER_POST_CODE, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
