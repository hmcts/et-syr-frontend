import config from 'config';

import { LegacyUrls } from '../../../main/definitions/constants';
import { getLegacySignUpUrl } from '../../../main/helpers/LegacyUrlHelper';

jest.mock('config');

const mockedConfig = config as jest.Mocked<typeof config>;

describe('LegacyUrlHelper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return configured ET3 legacy sign up URL', () => {
    mockedConfig.has.mockReturnValue(true);
    mockedConfig.get.mockReturnValue('https://et-syr.perftest.platform.hmcts.net/users/sign_up');

    expect(getLegacySignUpUrl()).toStrictEqual('https://et-syr.perftest.platform.hmcts.net/users/sign_up');
  });

  it('should return default sign up URL when ET3 legacy sign up URL is not configured', () => {
    mockedConfig.has.mockReturnValue(false);

    expect(getLegacySignUpUrl()).toStrictEqual(LegacyUrls.SIGN_UP);
  });
});
