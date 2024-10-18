import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import {
  FormFieldNames,
  LoggerConstants,
  PageUrls,
  TranslationKeys,
  ValidationErrors,
  languages,
} from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { convertJsonArrayToTitleCase } from '../helpers/CaseHelpers';
import { assignAddresses, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import StringUtils from '../utils/StringUtils';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentSelectPostCodeController');

export default class RespondentSelectPostCodeController {
  private readonly form: Form;
  private readonly respondentSelectPostCodeContent: FormContent = {
    fields: {
      respondentAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.selectAddress,
        id: 'respondentAddressTypes',
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentSelectPostCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    const errorRedirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SELECT_POST_CODE);
    if (req.session.errors.length > 0) {
      logger.error(LoggerConstants.ERROR_FORM_INVALID_DATA + 'Case Id: ' + req.session?.userCase?.id);
      return res.redirect(errorRedirectUrl);
    }
    const selectedAddressIndex = formData?.respondentAddressTypes?.toString();
    let selectedAddress;
    if (StringUtils.isNotBlank(selectedAddressIndex)) {
      selectedAddress = req.session?.userCase?.respondentAddresses?.at(selectedAddressIndex as unknown as number);
      if (selectedAddress) {
        req.session.userCase.responseRespondentAddressLine1 = selectedAddress.street1;
        req.session.userCase.responseRespondentAddressLine2 = selectedAddress.street2;
        req.session.userCase.responseRespondentAddressPostTown = selectedAddress.town;
        req.session.userCase.responseRespondentAddressCountry = selectedAddress.country;
        req.session.userCase.responseRespondentAddressPostCode = selectedAddress.postcode;
      }
    }
    if (!selectedAddress) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.SELECTED_ADDRESS_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(errorRedirectUrl);
    }
    const userCase: CaseWithId = await ET3Util.updateET3Data(
      req,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS
    );
    if (req.session.errors?.length > 0) {
      logger.error(LoggerConstants.ERROR_API);
      return res.redirect(errorRedirectUrl);
    } else {
      req.session.userCase = userCase;
      const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ENTER_ADDRESS);
      res.redirect(redirectUrl);
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SELECT_POST_CODE);
    const addressList = await getAddressesForPostcode(req.session.userCase.responseRespondentAddressPostCode);
    const response = convertJsonArrayToTitleCase(addressList);
    req.session.userCase.respondentAddresses = response;
    req.session.userCase.respondentAddressTypes = [];
    if (response.length > 0) {
      req.session.userCase.respondentAddressTypes.push({
        selected: true,
        label: req.url?.includes(languages.WELSH_URL_POSTFIX)
          ? localesCy.selectDefaultSeveral
          : locales.selectDefaultSeveral,
      });
    } else {
      req.session.userCase.respondentAddressTypes.push({
        selected: true,
        label: req.url?.includes(languages.WELSH_URL_POSTFIX) ? localesCy.selectDefaultNone : locales.selectDefaultNone,
      });
    }
    for (const address of response) {
      req.session.userCase.respondentAddressTypes.push({
        value: response.indexOf(address),
        label: address.fullAddress,
      });
    }
    const content = getPageContent(req, this.respondentSelectPostCodeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SELECT_POST_CODE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_SELECT_POST_CODE, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
