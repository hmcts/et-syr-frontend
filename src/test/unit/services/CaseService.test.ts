import axios from 'axios';

import { ServiceErrors } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import { mockAxiosError, mockAxiosErrorWithDataError } from '../mocks/mockAxios';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseApiDataResponse } from '../mocks/mockCaseApiDataResponse';
import { mockCaseWithIdWithHubLinkStatuses, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';

jest.mock('config');
jest.mock('axios');

describe('Case Service Tests', () => {
  const token = 'testToken';
  const hubLinkStatusesReadyToView = {
    documents: HubLinkStatus.READY_TO_VIEW,
    et1ClaimForm: HubLinkStatus.READY_TO_VIEW,
    hearingDetails: HubLinkStatus.READY_TO_VIEW,
    tribunalOrders: HubLinkStatus.READY_TO_VIEW,
    contactTribunal: HubLinkStatus.READY_TO_VIEW,
    respondentResponse: HubLinkStatus.READY_TO_VIEW,
    tribunalJudgements: HubLinkStatus.READY_TO_VIEW,
    respondentApplications: HubLinkStatus.READY_TO_VIEW,
    requestsAndApplications: HubLinkStatus.READY_TO_VIEW,
  };

  describe('Update draft case', () => {
    it('should update draft case data and return the updated data', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.updateDraftCase(mockCaseWithIdWithHubLinkStatuses);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while updating the draft case', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const axiosError = mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      mockedAxios.put.mockImplementation(() => {
        throw axiosError;
      });
      await expect(() => api.updateDraftCase(mockCaseWithIdWithHubLinkStatuses)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_UPDATING_DRAFT_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Update hub link statuses', () => {
    it('should update all hub link statuses to ready to view', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.updateHubLinksStatuses(mockCaseWithIdWithHubLinkStatuses);
      expect(value.data.case_data.hubLinksStatuses).toEqual(hubLinkStatusesReadyToView);
    });
    it('should throw exception when there is a problem while updating hub link statuses', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockImplementation(() => {
        throw mockAxiosErrorWithDataError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.updateHubLinksStatuses(mockCaseWithIdWithHubLinkStatuses)).rejects.toEqual(
        new Error(
          ServiceErrors.ERROR_UPDATING_HUB_LINKS_STATUSES +
            ServiceErrors.ERROR_CASE_NOT_FOUND +
            ', ' +
            ServiceErrors.ERROR_DUMMY_DATA
        )
      );
    });
  });

  describe('Get case by application request', () => {
    const request = mockRequest({ body: mockValidCaseWithId });
    it('should get case by application request', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.getCaseByApplicationRequest(request);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while getting case data by application request', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getCaseByApplicationRequest(request)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Assign case user role', () => {
    const caseId: string = '1234567890123456';
    const userId: string = 'testUserId';
    const userRole: string = '[DEFENDANT]';
    const expectedResponse = 'User roles successfully updated';
    it('should assign case user role', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(expectedResponse);
      const value = await api.assignCaseUserRole(caseId, userId, userRole);
      expect(value).toEqual(expectedResponse);
    });
    it('should throw exception when there is a problem while updating user role', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.assignCaseUserRole(caseId, userId, userRole)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Get user case', () => {
    const caseId: string = '1234567890123456';
    it('should get user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.getUserCase(caseId);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while getting user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getUserCase(caseId)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Get user cases', () => {
    it('should get user cases', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      const value = await api.getUserCases();
      expect(value.data).toEqual([mockCaseApiDataResponse]);
    });
    it('should throw exception when there is a problem while getting user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getUserCases()).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('getCaseApi', () => {
    test('should create a CaseApi', () => {
      expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
    });
  });
});
