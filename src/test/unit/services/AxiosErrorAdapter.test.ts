import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { axiosErrorDetails } from '../../../main/services/AxiosErrorAdapter';

describe('axiosErrorDetails', () => {
  // We define a helper to create the "base" so we don't have to repeat boilerplate
  const createMockError = (responseData?: any): AxiosError<any> => {
    return {
      name: 'AxiosError',
      message: 'Request failed with status code 500',
      isAxiosError: true,
      config: {} as InternalAxiosRequestConfig,
      response: responseData
        ? ({
            data: responseData,
            status: 500,
            statusText: 'Internal Server Error',
            headers: {},
            config: {} as InternalAxiosRequestConfig,
          } as AxiosResponse)
        : undefined,
      toJSON: () => ({}),
    } as AxiosError<any>;
  };

  it('should return only the error message when there is no response data', () => {
    const error = createMockError();
    const result = axiosErrorDetails(error);
    expect(result).toBe('Request failed with status code 500');
  });

  it('should append the string data when response data is a string', () => {
    const error = createMockError('Internal Server Error');
    const result = axiosErrorDetails(error);
    expect(result).toBe('Request failed with status code 500, Internal Server Error');
  });

  it('should append data.message when it exists in the response object', () => {
    const error = createMockError({
      message: 'Custom error message',
      error: 'Some technical error',
    });
    const result = axiosErrorDetails(error);
    expect(result).toBe('Request failed with status code 500, Custom error message');
  });

  it('should append data.error when data.message is missing', () => {
    const error = createMockError({
      error: 'Unauthorized Access',
    });
    const result = axiosErrorDetails(error);
    expect(result).toBe('Request failed with status code 500, Unauthorized Access');
  });

  it('should stringify the data object if it does not contain message or error properties', () => {
    const error = createMockError({
      code: 404,
      type: 'NOT_FOUND',
    });
    const result = axiosErrorDetails(error);
    expect(result).toBe('Request failed with status code 500, {"code":404,"type":"NOT_FOUND"}');
  });
});
