import { CUIClient } from '@hmcts/cui-client';
import config from 'config';

import { getCuiService } from '../../../main/services/CuiService';

jest.mock('@hmcts/cui-client', () => ({
  CUIActions: {
    SUBMIT: 'submit',
    CANCEL: 'cancel',
  },
  CUIClient: jest.fn().mockImplementation((clientConfig, options) => ({ clientConfig, options })),
  mergeCUIFlagItems: jest.fn((existingFlags = [], replacementFlags = []) => [...existingFlags, ...replacementFlags]),
}));

describe('CuiService', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const mockedCuiClient = CUIClient as unknown as jest.Mock;

  beforeEach(() => {
    mockedCuiClient.mockClear();
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should create a CUI client with configured service values', () => {
    getCuiService();

    expect(mockedCuiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: 'https://cui-ra.aat.platform.hmcts.net',
        hmctsServiceId: 'BHA1',
      })
    );
  });

  it('should include the logout URL when supplied', () => {
    getCuiService('https://localhost/logout');

    expect(mockedCuiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        logoutUrl: 'https://localhost/logout',
      })
    );
  });

  it('should disable TLS verification for local development', () => {
    process.env.NODE_ENV = 'development';

    getCuiService();

    const options = mockedCuiClient.mock.calls[0][1];
    expect(options.axiosConfig.httpsAgent.options.rejectUnauthorized).toBe(false);
  });

  it('should throw when CUI config is missing', () => {
    const originalGet = config.get.bind(config);
    const configGetSpy = jest.spyOn(config, 'get').mockImplementation((key: string) => {
      return key === 'services.cui' ? undefined : originalGet(key);
    });

    expect(() => getCuiService()).toThrow('Missing required configuration for CUI service');

    configGetSpy.mockRestore();
  });
});
