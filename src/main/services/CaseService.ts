import axiosService, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DefaultValues, JavaApiUrls, SessionErrors } from '../definitions/constants';
import { toApiFormat } from '../helpers/ApiFormatter';
import ErrorUtil from '../utils/ErrorUtil';

import { axiosErrorDetails } from './AxiosErrorAdapter';

export class CaseApi {
  constructor(private readonly axios: AxiosInstance) {}

  updateDraftCase = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.UPDATE_CASE_DRAFT, toApiFormat(caseItem));
    } catch (error) {
      throw new Error('Error updating draft case: ' + axiosErrorDetails(error));
    }
  };

  updateHubLinksStatuses = async (caseItem: CaseWithId): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.put(JavaApiUrls.UPDATE_CASE_SUBMITTED, {
        case_id: caseItem.id,
        case_type_id: caseItem.caseTypeId,
        hub_links_statuses: caseItem.hubLinksStatuses,
      });
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
  getCaseByIdRespondentAndClaimantNames = async (request: AppRequest): Promise<AxiosResponse<CaseApiDataResponse>> => {
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
        throw new Error('Error getting user case: ' + axiosErrorDetails(error));
      }
    } else {
      ErrorUtil.throwManuelError(
        SessionErrors.ERROR_FAILED_TO_RETRIEVE_USER_CASE_FROM_REQUEST_SESSION,
        SessionErrors.ERROR_NAME_DATA_NOT_FOUND
      );
    }
  };

  assignCaseUserRole = async (caseId: string, userId: string, caseRole: string): Promise<AxiosResponse<string>> => {
    try {
      return await this.axios.post(JavaApiUrls.ASSIGN_CASE_USER_ROLES, {
        case_users: [{ case_id: caseId, user_id: userId, case_role: caseRole }],
      });
    } catch (error) {
      throw new Error('Error getting user case: ' + axiosErrorDetails(error));
    }
  };

  getUserCase = async (id: string): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.post(JavaApiUrls.GET_CASE, { case_id: id });
    } catch (error) {
      throw new Error('Error getting user case: ' + axiosErrorDetails(error));
    }
  };

  getUserCases = async (): Promise<AxiosResponse<CaseApiDataResponse[]>> => {
    try {
      return await this.axios.get<CaseApiDataResponse[]>(JavaApiUrls.GET_CASES);
    } catch (error) {
      throw new Error('Error getting user cases: ' + axiosErrorDetails(error));
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
