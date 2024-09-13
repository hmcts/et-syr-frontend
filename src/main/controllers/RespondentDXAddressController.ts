import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';

const logger = getLogger('RespondentDXAddressController');

export default class RespondentDXAddressController {
  private readonly form: Form;
  private readonly respondentDxAddressContent: FormContent = {
    fields: {
      respondentDxAddress: {
        id: 'respondentDxAddress',
        name: 'respondentDxAddress',
        type: 'text',
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
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_DX_ADDRESS);

    const content = getPageContent(req, this.respondentDxAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DX_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_DX_ADDRESS, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
