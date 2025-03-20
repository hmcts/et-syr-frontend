import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { FormFieldNames, LoggerConstants, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { answersAddressFormatter } from '../helpers/AddressHelper';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect, returnValidUrl, startSubSection } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import NumberUtils from '../utils/NumberUtils';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentAddressController');

export default class RespondentAddressController {
  form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      et3IsRespondentAddressCorrect: {
        classes: 'govuk-radios--inline',
        id: 'et3IsRespondentAddressCorrect',
        type: 'radios',
        label: (l: AnyRecord): string => l.correctAddressQuestion,
        labelHidden: false,
        values: [
          {
            name: 'et3IsRespondentAddressCorrectYes',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'et3IsRespondentAddressCorrectNo',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: saveAndContinueButton,
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
      return res.redirect(returnValidUrl(errorRedirectUrl));
    }
    let redirectUrl: string = setUrlLanguage(req, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_POST_CODE);
      startSubSection(req, redirectUrl);

      await ET3Util.updateET3ResponseWithET3Form(
        req,
        res,
        this.form,
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS,
        redirectUrl,
        []
      );
    } else if (NumberUtils.isNotEmpty(req.session?.selectedRespondentIndex)) {
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
      await ET3Util.updateET3ResponseWithET3Form(
        req,
        res,
        this.form,
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS,
        redirectUrl,
        []
      );
    } else {
      logger.info(LoggerConstants.ERROR_SESSION_SELECTED_USER_NOT_FOUND + ' caseId: ' + req.session?.userCase?.id);
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.SESSION_RESPONDENT,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(returnValidUrl(errorRedirectUrl));
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
      userCase.respondentAddressLine1,
      userCase.respondentAddressLine2,
      userCase.respondentAddressLine3,
      userCase.respondentAddressPostTown,
      userCase.respondentAddressCounty,
      userCase.respondentAddressCountry,
      userCase.respondentAddressPostCode
    );

    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      redirectUrl,
      respondentAddress,
      hideContactUs: true,
    });
  };
}
