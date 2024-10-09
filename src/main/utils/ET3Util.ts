import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import {
  DefaultValues,
  ET3ModificationTypes,
  FormFieldNames,
  LoggerConstants,
  ValidationErrors,
} from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { setUserCase } from '../helpers/CaseHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import ErrorUtils from './ErrorUtils';
import StringUtils from './StringUtils';

const logger = getLogger('RespondentNameController');

export default class ET3Util {
  public static findSelectedRespondent(req: AppRequest): number {
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
    let selectedRespondentIndex: number = 0;
    for (const respondent of req.session.userCase.respondents) {
      if (respondent.idamId === req.session.user.id) {
        return selectedRespondentIndex;
      }
      selectedRespondentIndex++;
    }
    ErrorUtils.setManualErrorToRequestSession(
      req,
      ValidationErrors.RESPONDENT_NOT_FOUND,
      FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
    );
    logger.error(LoggerConstants.ERROR_SESSION_INVALID_RESPONDENT);
  }

  public static findSelectedRespondentByCaseWithId(req: AppRequest, caseWithId: CaseWithId): number {
    if (!caseWithId) {
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
    if (!caseWithId.respondents) {
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
    let selectedRespondentIndex: number = 0;
    for (const respondent of caseWithId.respondents) {
      if (respondent.idamId === req.session.user.id) {
        return selectedRespondentIndex;
      }
      selectedRespondentIndex++;
    }
    ErrorUtils.setManualErrorToRequestSession(
      req,
      ValidationErrors.RESPONDENT_NOT_FOUND,
      FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
    );
    logger.error(LoggerConstants.ERROR_SESSION_INVALID_RESPONDENT);
  }

  public static async updateET3Data(
    req: AppRequest,
    responseHubLinksSectionId: string,
    responseHubLinksSectionStatus: string
  ): Promise<CaseWithId> {
    let caseWithId: CaseWithId;
    try {
      caseWithId = formatApiCaseDataToCaseWithId(
        (
          await getCaseApi(req.session.user?.accessToken)?.modifyEt3Data(
            req.session?.userCase,
            req.session?.user?.id,
            ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
            ET3CaseDetailsLinkNames.RespondentResponse,
            LinkStatus.IN_PROGRESS,
            responseHubLinksSectionId,
            responseHubLinksSectionStatus
          )
        )?.data,
        req
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

  public static async updateET3ResponseWithET3Form(
    req: AppRequest,
    res: Response,
    form: Form,
    et3HubLinkName: string,
    et3HubLinkStatus: string,
    redirectUrl: string
  ): Promise<void> {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    req.session.errors = form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      logger.error(LoggerConstants.ERROR_FORM_INVALID_DATA + 'Form: ' + form);
      return res.redirect(req.url);
    }
    setUserCase(req, form);
    const userCase: CaseWithId = await ET3Util.updateET3Data(req, et3HubLinkName, et3HubLinkStatus);
    if (req.session.errors?.length > 0) {
      logger.error(LoggerConstants.ERROR_API);
      return res.redirect(req.url);
    } else {
      req.session.userCase = userCase;
      res.redirect(redirectUrl);
    }
  }
}
