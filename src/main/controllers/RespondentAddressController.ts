import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { FormFieldNames, LoggerConstants, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import ErrorUtils from '../utils/ErrorUtils';
import { isOptionSelected } from '../validators/validator';

export default class RespondentAddressController {
  form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddressQuestion: {
        classes: 'govuk-radios--inline',
        id: 'respondentAddressQuestion',
        type: 'radios',
        label: (l: AnyRecord): string => l.correctAddressQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentAddressQuestionYes',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentAddressQuestionNo',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    const errorRedirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ADDRESS);
    if (req.session.errors.length > 0) {
      logger.error(LoggerConstants.ERROR_FORM_INVALID_DATA + 'Case Id: ' + req.session?.userCase?.id);
      return res.redirect(errorRedirectUrl);
    }
    let redirectUrl: string = setUrlLanguage(req, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_POST_CODE);
      return res.redirect(redirectUrl);
    } else if (req.session.selectedRespondentIndex !== undefined && req.session.selectedRespondentIndex >= 0) {
      logger.info(LoggerConstants.INFO_LOG_UPDATING_RESPONSE_RESPONDENT_ADDRESS_SELECTION + req.session.userCase.id);
      const selectedRespondentAddress = req.session?.userCase?.respondents?.at(
        req.session.selectedRespondentIndex
      )?.respondentAddress;
      req.session.userCase.responseRespondentAddressLine1 = selectedRespondentAddress?.AddressLine1;
      req.session.userCase.responseRespondentAddressLine2 = selectedRespondentAddress?.AddressLine2;
      req.session.userCase.responseRespondentAddressLine3 = selectedRespondentAddress?.AddressLine3;
      req.session.userCase.responseRespondentAddressPostTown = selectedRespondentAddress?.PostTown;
      req.session.userCase.responseRespondentAddressCounty = selectedRespondentAddress?.County;
      req.session.userCase.responseRespondentAddressCountry = selectedRespondentAddress?.Country;
      req.session.userCase.responseRespondentAddressPostCode = selectedRespondentAddress?.PostCode;
      logger.info(LoggerConstants.INFO_LOG_UPDATED_RESPONSE_RESPONDENT_ADDRESS_SELECTION + req.session.userCase.id);
      return res.redirect(redirectUrl);
    } else {
      logger.info(LoggerConstants.ERROR_SESSION_SELECTED_USER_NOT_FOUND + ' caseId: ' + req.session?.userCase?.id);
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.SESSION_RESPONDENT,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(errorRedirectUrl);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ADDRESS);
    const userCase = req.session.userCase;

    const content = getPageContent(req, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);

    const respondentAddress = answersAddressFormatter(
      userCase.workAddressLine1,
      userCase.workAddressLine2,
      userCase.workAddressLine3,
      userCase.workAddressTown,
      userCase.workAddressCounty,
      userCase.workAddressCountry,
      userCase.workAddressPostcode
    );

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      redirectUrl,
      respondentAddress,
      hideContactUs: true,
    });
  };
}
