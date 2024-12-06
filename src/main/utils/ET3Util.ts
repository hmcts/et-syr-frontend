import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import {
  CLAIM_TYPES,
  DefaultValues,
  ET3ModificationTypes,
  FormFieldNames,
  LoggerConstants,
  PageUrls,
  ValidationErrors,
} from '../definitions/constants';
import { ApplicationTableRecord, TypesOfClaim } from '../definitions/definition';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { translateOverallStatus } from '../helpers/ApplicationTableRecordTranslationHelper';
import { setUserCase } from '../helpers/CaseHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { returnNextPage, returnValidUrl } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import CollectionUtils from './CollectionUtils';
import DateUtils from './DateUtils';
import ErrorUtils from './ErrorUtils';
import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

const logger = getLogger('ET3Util');

export default class ET3Util {
  public static findSelectedRespondentIndex(req: AppRequest): number {
    if (ObjectUtils.isEmpty(req.session)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.SESSION_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_NOT_FOUND);
      return;
    }
    if (ObjectUtils.isEmpty(req.session.userCase)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.SESSION_USER_CASE_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_USER_CASE_NOT_FOUND);
      return;
    }
    if (ObjectUtils.isEmpty(req.session.user)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.SESSION_USER,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_USER_NOT_FOUND);
      return;
    }
    if (CollectionUtils.isEmpty(req.session.userCase.respondents)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.SESSION_RESPONDENT,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_INVALID_RESPONDENT_LIST);
      return;
    }
    if (StringUtils.isBlank(req.session.user.id)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.USER_ID_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_INVALID_USER_ID);
      return;
    }
    const ccdIdParameter = req.params.ccdId;
    if (StringUtils.isBlank(ccdIdParameter)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.RESPONDENT_INDEX_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_SESSION_RESPONDENT_INDEX_NOT_FOUND);
      return;
    }
    let selectedRespondentIndex: number = 0;
    for (const respondent of req.session.userCase.respondents) {
      const ccdId = respondent.ccdId;
      if (
        respondent.idamId === req.session.user.id &&
        StringUtils.isNotBlank(ccdIdParameter) &&
        ccdIdParameter === ccdId
      ) {
        return selectedRespondentIndex;
      }
      selectedRespondentIndex++;
    }
    ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
      req,
      ValidationErrors.RESPONDENT_INDEX_NOT_FOUND,
      FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
    );
    logger.error(LoggerConstants.ERROR_SESSION_RESPONDENT_INDEX_NOT_FOUND);
  }

  public static async updateET3Data(
    req: AppRequest,
    responseHubLinksSectionId: string,
    responseHubLinksSectionStatus: string,
    modificationType?: string
  ): Promise<CaseWithId> {
    let caseWithId: CaseWithId;
    try {
      let caseDetailsLinkStatus = LinkStatus.SUBMITTED;
      if (!modificationType) {
        modificationType = ET3ModificationTypes.MODIFICATION_TYPE_UPDATE;
        caseDetailsLinkStatus = LinkStatus.IN_PROGRESS;
      }
      caseWithId = formatApiCaseDataToCaseWithId(
        (
          await getCaseApi(req.session.user?.accessToken)?.modifyEt3Data(
            req,
            modificationType,
            ET3CaseDetailsLinkNames.RespondentResponse,
            caseDetailsLinkStatus,
            responseHubLinksSectionId,
            responseHubLinksSectionStatus
          )
        )?.data,
        req
      );
    } catch (e) {
      logger.error(LoggerConstants.ERROR_API + 'modifyEt3Data' + DefaultValues.STRING_NEW_LINE + e);
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return;
    }
    return caseWithId;
  }

  public static async updateCaseDetailsLinkStatuses(
    req: AppRequest,
    caseDetailsLinksSectionId: string,
    caseDetailsLinksSectionStatus: string
  ): Promise<CaseWithId> {
    let caseWithId: CaseWithId;
    try {
      caseWithId = formatApiCaseDataToCaseWithId(
        (
          await getCaseApi(req.session.user?.accessToken)?.modifyEt3Data(
            req,
            ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
            caseDetailsLinksSectionId,
            caseDetailsLinksSectionStatus,
            DefaultValues.STRING_EMPTY,
            DefaultValues.STRING_EMPTY
          )
        )?.data,
        req
      );
    } catch (e) {
      logger.error(LoggerConstants.ERROR_API + 'modifyEt3Data' + DefaultValues.STRING_NEW_LINE + e);
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
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
    redirectUrl: string,
    fieldsToReset?: string[]
  ): Promise<void> {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    req.session.errors = form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      logger.error(LoggerConstants.ERROR_FORM_INVALID_DATA + ' Form: ' + form);
      return res.redirect(returnValidUrl(req.url));
    }
    setUserCase(req, formData, fieldsToReset);
    const userCase: CaseWithId = await ET3Util.updateET3Data(req, et3HubLinkName, et3HubLinkStatus);
    if (req.session.errors?.length > 0) {
      logger.error(LoggerConstants.ERROR_API);
      return res.redirect(returnValidUrl(req.url));
    } else {
      if (req.body?.saveForLater) {
        redirectUrl = setUrlLanguage(req, PageUrls.RESPONSE_SAVED);
      }
      req.session.userCase = userCase;
      returnNextPage(req, res, redirectUrl);
    }
  }

  public static getUserNameByRespondent(respondent: RespondentET3Model): string {
    if (!respondent) {
      return DefaultValues.STRING_EMPTY;
    }
    if (StringUtils.isNotBlank(respondent.respondentName)) {
      return respondent.respondentName;
    }
    if (StringUtils.isNotBlank(respondent.respondentOrganisation)) {
      return respondent.respondentOrganisation;
    }
    let respondentName: string = DefaultValues.STRING_EMPTY;
    if (StringUtils.isNotBlank(respondent.respondentFirstName)) {
      respondentName = respondent.respondentFirstName;
    }
    if (StringUtils.isNotBlank(respondent.respondentLastName)) {
      respondentName = respondentName + DefaultValues.STRING_SPACE + respondent.respondentLastName;
    }
    return respondentName.trim();
  }

  public static getUserApplicationsListItem(
    application: ApplicationTableRecord,
    respondentName: string,
    respondent: RespondentET3Model
  ): { text?: string; caseId?: string; caseDetailsLink?: string; respondentCcdId?: string }[] {
    return [
      {
        text: DateUtils.formatDateStringToDDMonthYYYY(application.userCase.responseReceivedDate), //todo: FIX NEEDED: doesn't show welsh date for some reason?
      },
      {
        text: application.userCase.ethosCaseReference,
      },
      {
        text: application.userCase.id,
      },
      {
        text: application.userCase.firstName + ' ' + application.userCase.lastName,
      },
      {
        text: respondentName,
      },
      {
        text: application.completionStatus,
      },
      {
        text: application.userCase.lastModified,
      },
      {
        caseDetailsLink: PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER,
        caseId: application.userCase.id,
        respondentCcdId: respondent.ccdId,
      },
    ];
  }

  public static getOverallStatus(
    userCase: CaseWithId,
    respondent: RespondentET3Model,
    translations: AnyRecord
  ): string {
    let totalSections: number = 5;
    if (
      CollectionUtils.isNotEmpty(userCase?.typeOfClaim) &&
      (userCase.typeOfClaim.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) ||
        userCase.typeOfClaim.includes(TypesOfClaim.BREACH_OF_CONTRACT))
    ) {
      totalSections = 6;
    }
    let sectionCount: number = 0;

    if (respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] === LinkStatus.COMPLETED) {
      sectionCount++;
    }

    if (respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] === LinkStatus.COMPLETED) {
      sectionCount++;
    }

    if (respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] === LinkStatus.COMPLETED) {
      sectionCount++;
    }

    if (respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] === LinkStatus.COMPLETED) {
      sectionCount++;
    }

    if (respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] === LinkStatus.COMPLETED) {
      sectionCount++;
    }

    if (
      CollectionUtils.isNotEmpty(userCase?.typeOfClaim) &&
      userCase.typeOfClaim.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) &&
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployersContractClaim] === LinkStatus.COMPLETED
    ) {
      sectionCount++;
    }
    const overallStatus: AnyRecord = {
      sectionCount,
      totalSections,
    };
    return translateOverallStatus(overallStatus, translations);
  }
}
