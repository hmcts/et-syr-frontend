import axios, { isAxiosError } from 'axios';
import config from 'config';

import { S2SService, getS2SService } from '../../../main/services/S2SService';

jest.mock('axios');

const mockOtpGenerate = jest.fn();

jest.mock('otplib', () => ({
  OTP: jest.fn().mockImplementation(() => ({
    generate: (...args: unknown[]) => mockOtpGenerate(...args),
  })),
  createGuardrails: jest.fn().mockReturnValue({}),
}));

describe('S2SService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedIsAxiosError = isAxiosError as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpGenerate.mockReturnValue('one-time-token');
    mockedIsAxiosError.mockReturnValue(false);
  });

  it('should generate a one-time token for a valid secret', async () => {
    const service = new S2SService('http://s2s.example', '12345678901234567890', 'et_syr');

    await expect(service.getOneTimeToken()).resolves.toBe('one-time-token');
    expect(mockOtpGenerate).toHaveBeenCalledWith({ secret: '12345678901234567890' });
  });

  it('should wrap one-time token generation errors with service context', async () => {
    const service = new S2SService('http://s2s.example', 'short', 'et_syr');
    mockOtpGenerate.mockImplementationOnce(() => {
      throw new Error('invalid secret');
    });

    await expect(service.getOneTimeToken()).rejects.toThrow('Failed to generate one-time token for service "et_syr"');
  });

  it('should lease and return a service token', async () => {
    const service = new S2SService('http://s2s.example', '12345678901234567890', 'et_syr');
    jest.spyOn(service, 'getOneTimeToken').mockResolvedValue('one-time-password');
    mockedAxios.post.mockResolvedValue({ status: 200, data: 'service-token' });

    await expect(service.getToken()).resolves.toBe('service-token');

    expect(mockedAxios.post).toHaveBeenCalledWith('http://s2s.example/lease', {
      microservice: 'et_syr',
      oneTimePassword: 'one-time-password',
    });
  });

  it('should reject an unexpected lease response status', async () => {
    const service = new S2SService('http://s2s.example', '12345678901234567890', 'et_syr');
    jest.spyOn(service, 'getOneTimeToken').mockResolvedValue('one-time-password');
    mockedAxios.post.mockResolvedValue({ status: 201, data: 'service-token' });

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease request returned unexpected status 201 from http://s2s.example/lease'
    );
  });

  it('should reject non-string lease response data', async () => {
    const service = new S2SService('http://s2s.example', '12345678901234567890', 'et_syr');
    jest.spyOn(service, 'getOneTimeToken').mockResolvedValue('one-time-password');
    mockedAxios.post.mockResolvedValue({ status: 200, data: { token: 'service-token' } });

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease response from http://s2s.example/lease had unexpected data type: object'
    );
  });

  it('should format axios lease errors with status and response detail', async () => {
    const service = new S2SService('http://s2s.example', '12345678901234567890', 'et_syr');
    jest.spyOn(service, 'getOneTimeToken').mockResolvedValue('one-time-password');
    mockedIsAxiosError.mockReturnValue(true);
    mockedAxios.post.mockRejectedValue({
      message: 'Request failed',
      response: {
        status: 403,
        data: { message: 'Forbidden' },
      },
    });

    await expect(service.getToken()).rejects.toThrow(
      'S2S lease request to http://s2s.example/lease failed (status 403): {"message":"Forbidden"}'
    );
  });

  it('should create a configured S2S service', () => {
    expect(getS2SService()).toBeInstanceOf(S2SService);
  });

  it('should throw when required S2S config is missing', () => {
    const originalGet = config.get.bind(config);
    const configGetSpy = jest.spyOn(config, 'get').mockImplementation((key: string) => {
      return key === 'services.s2s.secret' ? '' : originalGet(key);
    });

    expect(() => getS2SService()).toThrow(
      'Missing required configuration for S2S service: endpoint, secret, and serviceName must all be provided'
    );

    configGetSpy.mockRestore();
  });
});
