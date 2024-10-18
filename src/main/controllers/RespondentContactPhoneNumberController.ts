import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isPhoneNumberValid } from '../validators/validator';

export default class RespondentContactPhoneNumberController {
  private readonly form: Form;
  private readonly respondentContactPhoneNumber: FormContent = {
    fields: {
      responseRespondentPhone1: {
        id: 'responseRespondentPhone1',
        name: 'responseRespondentPhone1',
        type: 'text',
        hint: (l: AnyRecord): string => l.respondentContactPhoneNumber,
        classes: 'govuk-text',
        attributes: { maxLength: 20 },
        validator: isPhoneNumberValid,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentContactPhoneNumber.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_CONTACT_PREFERENCES
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);

    const content = getPageContent(req, this.respondentContactPhoneNumber, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
