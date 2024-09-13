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
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentSelectPostCodeController');

export default class RespondentSelectPostCodeController {
  private readonly form: Form;
  // TODO: text, will need to be changed to option when addresses are loaded based on postcode
  private readonly respondentSelectPostCodeContent: FormContent = {
    fields: {
      addressEnterPostcode: {
        type: 'text',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.selectAddress,
        id: 'addressAddressTypes',
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentSelectPostCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SELECT_POST_CODE);

    const content = getPageContent(req, this.respondentSelectPostCodeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SELECT_POST_CODE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_SELECT_POST_CODE, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
