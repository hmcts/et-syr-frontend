import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../../definitions/case';
import { DefaultValues, FormFieldNames, ValidationErrors } from '../../definitions/constants';
import CollectionUtils from '../../utils/CollectionUtils';
import ErrorUtils from '../../utils/ErrorUtils';
import NumberUtils from '../../utils/NumberUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

export default class EmployersContractClaimDetailsControllerHelper {
  public static areInputValuesValid(req: AppRequest, formData: Partial<CaseWithId>): boolean {
    req.session.errors = [];
    let selectedRespondent: RespondentET3Model;
    if (
      NumberUtils.isNotEmpty(req.session.selectedRespondentIndex) &&
      ObjectUtils.isNotEmpty(req.session.userCase) &&
      CollectionUtils.isNotEmpty(req.session.userCase.respondents) &&
      ObjectUtils.isNotEmpty(req.session.userCase.respondents[req.session.selectedRespondentIndex])
    ) {
      selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
    }
    const et3ResponseEmployerClaimDetailsText = formData.et3ResponseEmployerClaimDetails;
    const employerClaimDetailsProvided = StringUtils.isNotBlank(et3ResponseEmployerClaimDetailsText);
    const employerClaimDetailsMoreThan3000Chars = StringUtils.isLengthMoreThan(
      et3ResponseEmployerClaimDetailsText,
      DefaultValues.EMPLOYERS_CLAIM_DETAILS_MAX_LENGTH
    );
    const claimSummaryFileExists =
      ObjectUtils.isNotEmpty(req.file) ||
      ObjectUtils.isNotEmpty(req.session.userCase.et3ResponseEmployerClaimDocument) ||
      ObjectUtils.isNotEmpty(selectedRespondent?.et3ResponseEmployerClaimDocument);
    if (!claimSummaryFileExists && !employerClaimDetailsProvided) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.REQUIRED,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return false;
    }
    if (employerClaimDetailsMoreThan3000Chars) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.TOO_LONG,
        FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS
      );
      return false;
    }
    return true;
  }
}
