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
  mockAxiosResponseWithStringTrueResponse: {
    data: 'true',
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
  mockAxiosResponseWithStringFalseResponse: {
    data: 'false',
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
  mockAxiosResponseWithBooleanFalseResponse: {
    data: false,
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
  mockAxiosResponseWithBooleanTrueResponse: {
    data: true,
    status: 200,
    statusText: '',
    headers: undefined as never,
    config: undefined as never,
  },
};
