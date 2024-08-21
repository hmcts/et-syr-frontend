import axiosService, { AxiosInstance, AxiosResponse } from 'axios';
import config from 'config';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { CaseWithId } from '../definitions/case';
import { JavaApiUrls } from '../definitions/constants';
import { toApiFormat } from '../helpers/ApiFormatter';

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

  getCaseByIdRespondentAndClaimantNames = async (
    caseSubmissionReference: string,
    respondentName: string,
    claimantFirstNames: string,
    claimantLastName: string
  ): Promise<AxiosResponse<CaseApiDataResponse>> => {
    try {
      return await this.axios.post(JavaApiUrls.FIND_CASE_FOR_ROLE_MODIFICATION, {
        caseSubmissionReference,
        respondentName,
        claimantFirstNames,
        claimantLastName,
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
