import axiosService, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';
import FormData from 'form-data';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { UploadedFile } from '../definitions/api/uploadedFile';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DefaultValues, JavaApiUrls, Roles, ServiceErrors, SessionErrors } from '../definitions/constants';
import { application } from '../definitions/contact-tribunal-applications';
import { toApiFormat } from '../helpers/ApiFormatter';
import { Logger } from '../logger';
import ET3DataModelUtil from '../utils/ET3DataModelUtil';
import ErrorUtils from '../utils/ErrorUtils';

import { axiosErrorDetails } from './AxiosErrorAdapter';

export class CaseApi {
  constructor(private readonly axios: AxiosInstance) {}

  updateDraftCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.UPDATE_CASE_DRAFT, toApiFormat(caseItem));
    } catch (error) {
      throw new Error(ServiceErrors.ERROR_UPDATING_DRAFT_CASE + axiosErrorDetails(error));
    }
  };

  updateHubLinksStatuses = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(
        JavaApiUrls.UPDATE_CASE_SUBMITTED +
          DefaultValues.STRING_QUESTION_MARK +
          JavaApiUrls.ROLE_PARAM_NAME +
          DefaultValues.STRING_EQUALS +
          Roles.DEFENDANT_ROLE_WITHOUT_BRACKETS,
        {
          case_id: caseItem.id,
          case_type_id: caseItem.caseTypeId,
          hub_links_statuses: caseItem.hubLinksStatuses,
        }
      );
    } catch (error) {
      throw new Error('Error updating hub links statuses: ' + axiosErrorDetails(error));
    }
  };
  /**
   * Retrieves case data by userCase value of the session(req.session.userCase).
   * throws an exception when there is no value of userCase in the session.
   * @param request receives userCase from request object's session field. Fields that we use from userCase are:
   *                id Case id, usually referred as case submission reference entered to the form by respondent.
   *                id value can be only 16 digit decimal or 16 digit divided by dash like 1234-5678-1234-5678.
   *                If it is divided by dash, this method automatically removes dash values with empty string.
   *                respondentName Name of the respondent entered to the form by respondent.
   *                firstName First Name of the claimant entered to the form by respondent.
   *                lastName Last name of the claimant entered to the form by respondent.
   */
  getCaseByApplicationRequest = async (request: AppRequest): Promise<AxiosResponse<CaseApiDataResponse>> => {
    if (request.session.userCase) {
      try {
        const caseWithId: CaseWithId = request.session.userCase;
        let caseSubmissionReference = caseWithId.id;
        if (caseSubmissionReference?.includes(DefaultValues.STRING_DASH)) {
          caseSubmissionReference = caseSubmissionReference.replace(
            DefaultValues.STRING_DASH,
            DefaultValues.STRING_EMPTY
          );
        }
        return await this.axios.post(JavaApiUrls.FIND_CASE_FOR_ROLE_MODIFICATION, {
          caseSubmissionReference,
          respondentName: caseWithId.respondentName,
          claimantFirstNames: caseWithId.firstName,
          claimantLastName: caseWithId.lastName,
        });
      } catch (error) {
        throw new Error(ServiceErrors.ERROR_GETTING_USER_CASE + axiosErrorDetails(error));
      }
    } else {
      ErrorUtils.throwManualError(
        SessionErrors.ERROR_FAILED_TO_RETRIEVE_USER_CASE_FROM_REQUEST_SESSION,
        SessionErrors.ERROR_NAME_DATA_NOT_FOUND
      );
    }
  };

  assignCaseUserRole = async (request: AppRequest): Promise<AxiosResponse<string>> => {
    try {
      return await this.axios.post(JavaApiUrls.ASSIGN_CASE_USER_ROLES, {
        case_users: [
          {
            case_id: request.session.userCase.id,
            user_id: request.session.user.id,
            case_role: Roles.DEFENDANT_ROLE_WITH_BRACKETS,
            case_type_id: request.session.userCase.caseTypeId,
            respondent_name: request.session.respondentNameFromForm,
          },
        ],
      });
    } catch (error) {
      throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + axiosErrorDetails(error));
    }
  };

  getUserCase = async (id: string): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.post(
        JavaApiUrls.GET_CASE +
          DefaultValues.STRING_QUESTION_MARK +
          JavaApiUrls.ROLE_PARAM_NAME +
          DefaultValues.STRING_EQUALS +
          Roles.DEFENDANT_ROLE_WITHOUT_BRACKETS,
        { case_id: id }
      );
    } catch (error) {
      throw new Error('Error getting user case: ' + axiosErrorDetails(error));
    }
  };

  getUserCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    try {
      return await this.axios.get<CaseApiDataResponse[]>(
        JavaApiUrls.GET_CASES +
          DefaultValues.STRING_QUESTION_MARK +
          JavaApiUrls.ROLE_PARAM_NAME +
          DefaultValues.STRING_EQUALS +
          Roles.DEFENDANT_ROLE_WITHOUT_BRACKETS
      );
    } catch (error) {
      throw new Error('Error getting user cases: ' + axiosErrorDetails(error));
    }
  };

  checkEthosCaseReference = async (ethosCaseReference: string): Promise<AxiosResponse<string>> => {
    try {
      return await this.axios.get<string>(
        JavaApiUrls.FIND_CASE_BY_ETHOS_CASE_REFERENCE +
          DefaultValues.STRING_QUESTION_MARK +
          JavaApiUrls.FIND_CASE_BY_ETHOS_CASE_REFERENCE_PARAM_NAME +
          DefaultValues.STRING_EQUALS +
          ethosCaseReference
      );
    } catch (error) {
      throw new Error('Error getting user cases: ' + axiosErrorDetails(error));
    }
  };

  checkIdAndState = async (id: string): Promise<AxiosResponse<string>> => {
    try {
      return await this.axios.get<string>(
        JavaApiUrls.FIND_CASE_BY_ID + DefaultValues.STRING_QUESTION_MARK + 'id' + DefaultValues.STRING_EQUALS + id
      );
    } catch (error) {
      throw new Error('Error getting user cases: ' + axiosErrorDetails(error));
    }
  };

  modifyEt3Data = async (
    req: AppRequest,
    requestType: string,
    caseDetailsLinksSectionId: string,
    caseDetailsLinksSectionStatus: string,
    responseHubLinksSectionId: string,
    responseHubLinksSectionStatus: string
  ): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      const et3Request = ET3DataModelUtil.convertCaseWithIdToET3Request(
        req,
        requestType,
        caseDetailsLinksSectionId,
        caseDetailsLinksSectionStatus,
        responseHubLinksSectionId,
        responseHubLinksSectionStatus
      );
      return await this.axios.post(JavaApiUrls.MODIFY_ET3_DATA, et3Request);
    } catch (error) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE + axiosErrorDetails(error));
    }
  };

  getCaseDocument = async (docId: string): Promise<AxiosResponse> => {
    try {
      return await this.axios.get(`${JavaApiUrls.DOCUMENT_DOWNLOAD}${docId}`, {
        responseType: 'arraybuffer',
      });
    } catch (error) {
      throw new Error('Error fetching document: ' + axiosErrorDetails(error));
    }
  };

  uploadDocument = async (file: UploadedFile, caseTypeId: string): Promise<AxiosResponse<DocumentUploadResponse>> => {
    try {
      const formData: FormData = new FormData();
      formData.append('document_upload', file.buffer, file.originalname);

      return await this.axios.post(JavaApiUrls.UPLOAD_FILE + caseTypeId, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (error) {
      throw new Error('Error uploading document: ' + axiosErrorDetails(error));
    }
  };

  submitRespondentTse = async (req: AppRequest, logger: Logger): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      const caseItem = req.session.userCase;
      const appType = Object.values(application).filter(app => app.code === caseItem.contactApplicationType)[0];
      const result = await this.axios.put(JavaApiUrls.SUBMIT_RESPONDENT_APPLICATION, {
        case_id: caseItem.id,
        case_type_id: caseItem.caseTypeId,
        type_c: application.ORDER_WITNESS_ATTEND.code.includes(caseItem.contactApplicationType),
        respondent_tse: {
          contactApplicationType: caseItem.contactApplicationType,
          contactApplicationClaimantType: appType.claimant,
          contactApplicationText: caseItem.contactApplicationText,
          contactApplicationFile: caseItem.contactApplicationFile,
          copyToOtherPartyYesOrNo: caseItem.copyToOtherPartyYesOrNo,
          copyToOtherPartyText: caseItem.copyToOtherPartyText,
        },
      });
      logger.info('Submitted respondent tse for case:' + `${req.session.userCase.id}`);
      return result;
    } catch (error) {
      throw new Error('Error submitting respondent tse application: ' + axiosErrorDetails(error));
    }
  };
}

export const getCaseApi = (token: string): CaseApi => {
  return new CaseApi(
    axiosService.create({
      baseURL: process.env.ET_SYA_API_HOST ?? config.get('services.etSyaApi.host'),
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
  );
};
