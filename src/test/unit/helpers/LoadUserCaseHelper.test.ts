import axios from 'axios';

import { LoadUserCaseResults, loadUserCaseFromApi } from '../../../main/helpers/LoadUserCaseHelper';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('LoadUserCaseHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
  });

  describe('loadUserCaseFromApi', () => {
    it('should load user case when api call succeeds', async () => {
      caseApi.getUserCase = jest.fn().mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const request = mockRequest({});
      request.session.user = mockUserDetails;
      const response = mockResponse();

      await expect(loadUserCaseFromApi(request, response, '1234', 'ccd-1')).resolves.toBe(LoadUserCaseResults.LOADED);
    });

    it('should return transferred when access failure redirects', async () => {
      caseApi.getUserCase = jest
        .fn()
        .mockRejectedValue(new Error('Error getting user case: status code 410, CASE_TRANSFERRED_TO_ECM'));
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      request.session.user = mockUserDetails;
      request.url = '/case-details/1234?lng=en';
      const response = mockResponse();

      await expect(loadUserCaseFromApi(request, response, '1234', 'ccd-1')).resolves.toBe(
        LoadUserCaseResults.TRANSFERRED
      );
    });

    it('should return failed when access failure does not redirect', async () => {
      caseApi.getUserCase = jest
        .fn()
        .mockRejectedValue(new Error('Error getting user case: Request failed with status code 500'));
      const request = mockRequest({});
      request.session.user = mockUserDetails;
      const response = mockResponse();

      await expect(loadUserCaseFromApi(request, response, '1234')).resolves.toBe(LoadUserCaseResults.FAILED);
      expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    });
  });
});
