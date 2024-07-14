import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import { handleUpdateDraftCase, handleUpdateHubLinksStatuses } from '../../../../main/controllers/helpers/CaseHelpers';
import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { CaseState } from '../../../../main/definitions/definition';
import * as CaseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockSession } from '../../mocks/mockApp';
import { mockLogger } from '../../mocks/mockLogger';
import { mockRequest } from '../../mocks/mockRequest';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');

mockClient.mockReturnValue(caseApi);

describe('handle update draft case', () => {
  it('should successfully save case draft', () => {
    caseApi.updateDraftCase = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.DRAFT,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    handleUpdateDraftCase(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });
});

describe('handle update hub links statuses', () => {
  it('should successfully update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.DRAFT,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    await handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated hub links statuses for case: testUserCaseId');
  });

  it('should catch failure when update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockRejectedValueOnce({ message: 'test error' });

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    await handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);

    expect(mockLogger.error).toHaveBeenCalledWith('test error');
  });
});
