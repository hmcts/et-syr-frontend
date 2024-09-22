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
import { isFieldFilledIn } from '../validators/validator';

const logger = getLogger('RespondentEnterAddressController');

export default class RespondentEnterAddressController {
  private readonly form: Form;
  private readonly respondentEnterAddressContent: FormContent = {
    fields: {
      addressLine1: {
        id: 'addressLine1',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine1,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      addressLine2: {
        id: 'addressLine2',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine2,
        classes: 'govuk-label govuk-!-width-one-half',
      },
      townOrCity: {
        id: 'townOrCity',
        type: 'text',
        label: (l: AnyRecord): string => l.townOrCity,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      country: {
        id: 'country',
        type: 'text',
        label: (l: AnyRecord): string => l.country,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      postcodeOrAreaCode: {
        id: 'postcodeOrAreaCode',
        type: 'text',
        label: (l: AnyRecord): string => l.postcodeOrAreaCode,
        classes: 'govuk-label govuk-!-width-one-half',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentEnterAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_ADDRESS);

    const content = getPageContent(req, this.respondentEnterAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ENTER_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ENTER_ADDRESS, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
