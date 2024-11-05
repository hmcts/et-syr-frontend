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

export default class RespondentDXAddressController {
  private readonly form: Form;
  private readonly respondentDxAddressContent: FormContent = {
    fields: {
      et3ResponseDXAddress: {
        id: 'et3ResponseDXAddress',
        name: 'et3ResponseDXAddress',
        type: 'text',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: true,
        hint: (l: AnyRecord): string => l.respondentDxAddress,
        classes: 'govuk-text',
        attributes: { maxLength: 100 },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentDxAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_DX_ADDRESS);

    const content = getPageContent(req, this.respondentDxAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DX_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_DX_ADDRESS, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
