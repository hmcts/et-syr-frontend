import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { LoggerConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { endSubSection } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLessAndNotEmpty, isFieldFilledIn } from '../validators/validator';

const logger = getLogger('RespondentEnterAddressController');

export default class RespondentEnterAddressController {
  private readonly form: Form;
  private readonly respondentEnterAddressContent: FormContent = {
    fields: {
      responseRespondentAddressLine1: {
        id: 'responseRespondentAddressLine1',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine1,
        classes: 'govuk-label govuk-!-width-one-half',
        attributes: { maxLength: 100 },
        validator: isContentCharsOrLessAndNotEmpty(100),
      },
      responseRespondentAddressLine2: {
        id: 'responseRespondentAddressLine2',
        type: 'text',
        label: (l: AnyRecord): string => l.addressLine2,
        classes: 'govuk-label govuk-!-width-one-half',
      },
      responseRespondentAddressPostTown: {
        id: 'responseRespondentAddressPostTown',
        type: 'text',
        label: (l: AnyRecord): string => l.townOrCity,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      responseRespondentAddressCountry: {
        id: 'responseRespondentAddressCountry',
        type: 'text',
        label: (l: AnyRecord): string => l.country,
        classes: 'govuk-label govuk-!-width-one-half',
        validator: isFieldFilledIn,
      },
      responseRespondentAddressPostCode: {
        id: 'responseRespondentAddressPostCode',
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
    logger.info(LoggerConstants.INFO_LOG_UPDATING_RESPONSE_RESPONDENT_ADDRESS + req.session.userCase.id);
    const redirectUrl = PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME;
    endSubSection(req);

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      redirectUrl
    );
    logger.info(LoggerConstants.INFO_LOG_UPDATED_RESPONSE_RESPONDENT_ADDRESS + req.session.userCase.id);
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
