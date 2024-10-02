import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, Respondent } from '../definitions/case';
import {
  DefaultValues,
  ET3ModificationTypes,
  FormFieldNames,
  LoggerConstants,
  ValidationErrors,
} from '../definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import ErrorUtils from './ErrorUtils';
import StringUtils from './StringUtils';

const logger = getLogger('RespondentNameController');

export default class ET3Util {
  public static findSelectedRespondent(req: AppRequest): Respondent {
    if (!req.session?.userCase) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.SESSION_USER_CASE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_USER_CASE_NOT_FOUND);
      return;
    }
    if (!req.session.user) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.SESSION_USER,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_USER_NOT_FOUND);
      return;
    }
    if (!req.session.userCase.respondents) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.SESSION_RESPONDENT,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_INVALID_RESPONDENT_LIST);
      return;
    }
    if (StringUtils.isBlank(req.session.user.id)) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.USER_ID,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_INVALID_USER_ID);
      return;
    }

    for (const respondent of req.session.userCase.respondents) {
      if (respondent.idamId === req.session.user.id) {
        return respondent;
      }
    }
    ErrorUtils.setManualErrorToRequestSession(
      req,
      ValidationErrors.RESPONDENT_NOT_FOUND,
      FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
    );
    logger.error(LoggerConstants.ERROR_SESSION_INVALID_RESPONDENT);
  }

  public static async updateET3Data(req: AppRequest): Promise<CaseWithId> {
    let caseWithId: CaseWithId;
    try {
      caseWithId = formatApiCaseDataToCaseWithId(
        (
          await getCaseApi(req.session.user?.accessToken)?.modifyEt3Data(
            req.session?.userCase,
            req.session?.user?.id,
            ET3ModificationTypes.MODIFICATION_TYPE_UPDATE
          )
        )?.data
      );
    } catch (e) {
      logger.error(LoggerConstants.ERROR_API + 'modifyEt3Data' + DefaultValues.STRING_NEW_LINE + e);
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return;
    }
    return caseWithId;
  }
}
