import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isValidUKPostcode } from '../validators/address_validator';

export default class RespondentEnterPostCodeController {
  private readonly form: Form;
  private readonly respondentEnterPostCodeContent: FormContent = {
    fields: {
      respondentAddressPostCode: {
        id: 'respondentAddressPostCode',
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_SELECT_POST_CODE
    );
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
