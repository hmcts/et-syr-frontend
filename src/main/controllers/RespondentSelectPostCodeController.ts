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
import { isOptionSelected } from '../validators/validator';

export default class RespondentSelectPostCodeController {
  private readonly form: Form;
  // TODO: text, will need to be changed to option when addresses are loaded based on postcode, for now I've put it as the postCode value
  private readonly respondentSelectPostCodeContent: FormContent = {
    fields: {
      respondentAddressPostCode: {
        type: 'text',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.selectAddress,
        id: 'respondentAddressPostCode',
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
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
