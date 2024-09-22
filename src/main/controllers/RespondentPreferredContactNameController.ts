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
import { isNameValid } from '../validators/validator';

const logger = getLogger('RespondentPreferredContactNameController');

export default class RespondentPreferredContactNameController {
  private readonly form: Form;
  private readonly respondentPreferredContactNameContent: FormContent = {
    fields: {
      respondentPreferredContactName: {
        id: 'respondentPreferredContactName',
        name: 'respondentPreferredContactName',
        type: 'text',
        hint: (l: AnyRecord): string => l.respondentPreferredContactName,
        classes: 'govuk-text',
        attributes: { maxLength: 100 },
        validator: isNameValid,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentPreferredContactNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_DX_ADDRESS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);

    const content = getPageContent(req, this.respondentPreferredContactNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
