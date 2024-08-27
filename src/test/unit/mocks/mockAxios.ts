import { AxiosError, AxiosHeaders } from 'axios';

import { ServiceErrors } from '../../../main/definitions/constants';

export const mockAxiosError = (type: string, message: string, status: number): AxiosError => {
  const headers = new AxiosHeaders();
  const config = {
    url: 'http://localhost:3000',
    headers,
  };
  return {
    isAxiosError: true,
    name: '',
    message,
    toJSON: () => ({}),
    config,
    response: {
      data: { type, message },
      status,
      statusText: 'Conflict',
      headers,
      config,
    },
  };
};

export const mockAxiosErrorWithDataError = (type: string, message: string, status: number): AxiosError => {
  const headers = new AxiosHeaders();
  const config = {
    url: 'http://localhost:3000',
    headers,
  };
  const error = ServiceErrors.ERROR_DUMMY_DATA;
  return {
    isAxiosError: true,
    name: '',
    message,
    toJSON: () => ({}),
    config,
    response: {
      data: { type, message, error },
      status,
      statusText: 'Conflict',
      headers,
      config,
    },
  };
};
