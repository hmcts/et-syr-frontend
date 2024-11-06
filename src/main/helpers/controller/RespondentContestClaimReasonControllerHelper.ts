import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { DefaultValues, FormFieldNames, ValidationErrors } from '../../definitions/constants';
import CollectionUtils from '../../utils/CollectionUtils';
import ErrorUtils from '../../utils/ErrorUtils';
import StringUtils from '../../utils/StringUtils';

export default class RespondentContestClaimReasonControllerHelper {
  public static areInputValuesValid(req: AppRequest, formData: Partial<CaseWithId>): boolean {
    req.session.errors = [];
    const et3ResponseContestClaimDetailsText = formData.et3ResponseContestClaimDetails;
    const respondentContestClaimReasonProvided = StringUtils.isNotBlank(et3ResponseContestClaimDetailsText);
    const respondentContestClaimReasonMoreThan3000Chars = StringUtils.isLengthMoreThan(
      et3ResponseContestClaimDetailsText,
      DefaultValues.CONTEST_CLAIM_REASON_MAX_LENGTH
    );
    const contestClaimDocumentsExist = CollectionUtils.isNotEmpty(req.session.userCase.et3ResponseContestClaimDocument);
    if (!respondentContestClaimReasonProvided && !contestClaimDocumentsExist) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.REQUIRED,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return false;
    }
    if (respondentContestClaimReasonProvided && contestClaimDocumentsExist) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.TEXT_AND_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return false;
    }
    if (respondentContestClaimReasonMoreThan3000Chars) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.TOO_LONG,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS
      );
      return false;
    }
    return true;
  }
}
