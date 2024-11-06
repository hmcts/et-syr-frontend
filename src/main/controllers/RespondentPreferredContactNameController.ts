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
import { isContentCharsOrLess, isNameValid } from '../validators/validator';

export default class RespondentPreferredContactNameController {
  private readonly form: Form;
  private readonly respondentPreferredContactNameContent: FormContent = {
    fields: {
      et3ResponseRespondentContactName: {
        id: 'et3ResponseRespondentContactName',
        name: 'et3ResponseRespondentContactName',
        type: 'text',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: true,
        hint: (l: AnyRecord): string => l.respondentPreferredContactName,
        classes: 'govuk-text',
        attributes: { maxLength: 60 },
        validator: isContentCharsOrLess(60),
        isNameValid,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentPreferredContactNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_DX_ADDRESS
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    const content = getPageContent(req, this.respondentPreferredContactNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
