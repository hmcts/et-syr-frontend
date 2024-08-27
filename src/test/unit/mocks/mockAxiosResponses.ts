import { mockCaseApiDataResponse } from './mockCaseApiDataResponse';

export const MockAxiosResponses = {
  mockAxiosResponseWithCaseApiDataResponseList: {
    data: [mockCaseApiDataResponse],
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
  mockAxiosResponseWithCaseApiDataResponse: {
    data: mockCaseApiDataResponse,
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
};
