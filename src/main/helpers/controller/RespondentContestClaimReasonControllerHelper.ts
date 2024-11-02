import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { DefaultValues, FormFieldNames, ValidationErrors } from '../../definitions/constants';
import { Logger } from '../../logger';
import CollectionUtils from '../../utils/CollectionUtils';
import ErrorUtils from '../../utils/ErrorUtils';
import StringUtils from '../../utils/StringUtils';
import { hasInvalidFileFormat, hasInvalidFileName } from '../../validators/validator';

export default class RespondentContestClaimReasonControllerHelper {
  public static areInputValuesValid(
    req: AppRequest,
    formData: Partial<CaseWithId>,
    fileList: Express.Multer.File[],
    logger: Logger
  ): boolean {
    req.session.errors = [];
    const et3ResponseContestClaimDetailsText = formData.et3ResponseContestClaimDetails;
    const respondentContestClaimReasonProvided = StringUtils.isNotBlank(et3ResponseContestClaimDetailsText);
    const respondentContestClaimReasonMoreThan3000Chars = StringUtils.isLengthMoreThan(
      et3ResponseContestClaimDetailsText,
      DefaultValues.CONTEST_CLAIM_REASON_MAX_LENGTH
    );
    const contestClaimDocumentsExist = CollectionUtils.isNotEmpty(fileList);
    let fileFormatInvalid = false;
    for (const file of fileList) {
      if (hasInvalidFileFormat(file, logger) === ValidationErrors.INVALID_FILE_FORMAT) {
        fileFormatInvalid = true;
      }
    }
    let fileNameInvalid = false;
    for (const file of fileList) {
      if (hasInvalidFileName(file.originalname) === ValidationErrors.INVALID_FILE_NAME) {
        fileNameInvalid = true;
      }
    }
    if (!respondentContestClaimReasonProvided && !contestClaimDocumentsExist) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.REQUIRED,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS
      );
      return false;
    }
    if (respondentContestClaimReasonProvided && contestClaimDocumentsExist) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.TEXT_AND_FILE,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS
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
    if (contestClaimDocumentsExist && fileFormatInvalid) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_FORMAT,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    if (contestClaimDocumentsExist && fileNameInvalid) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NAME,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    return true;
  }
}
