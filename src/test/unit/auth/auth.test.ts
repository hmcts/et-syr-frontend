import axios from 'axios';
import config from 'config';

import { getRedirectUrl, getUserDetails } from '../../../main/auth';
import {
  AuthUrls,
  AuthorisationTestConstants,
  GenericTestConstants,
  languages,
} from '../../../main/definitions/constants';

const loginUrl =
  process.env.IDAM_WEB_URL ?? config.get(AuthorisationTestConstants.AUTHORISATION_URL_CONFIGURATION_NAME);
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('AuthorisationTest', () => {
  describe('getRedirectUrl', () => {
    test('should create a valid URL to redirect to the login screen', () => {
      expect(
        getRedirectUrl(
          AuthorisationTestConstants.URL_LOCALHOST,
          AuthUrls.CALLBACK,
          AuthorisationTestConstants.GUID,
          languages.ENGLISH
        )
      ).toBe(
        `${loginUrl}?client_id=et-syr&response_type=code&redirect_uri=http://localhost/oauth2/callback&state=${AuthorisationTestConstants.GUID}&ui_locales=${languages.ENGLISH}`
      );
    });
  });

  describe('getUserDetails', () => {
    test('should exchange a code for a token and decode a JWT to get the generic user details', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          access_token: AuthorisationTestConstants.GENERIC_USER_TOKEN,
          id_token: AuthorisationTestConstants.GENERIC_USER_TOKEN,
        },
      });
      const result = await getUserDetails(
        AuthorisationTestConstants.URL_LOCALHOST,
        AuthorisationTestConstants.RAW_CODE,
        AuthUrls.CALLBACK
      );
      expect(result).toStrictEqual({
        accessToken: AuthorisationTestConstants.GENERIC_USER_TOKEN,
        email: AuthorisationTestConstants.GENERIC_USER_EMAIL,
        givenName: AuthorisationTestConstants.GENERIC_USER_GIVEN_NAME,
        familyName: AuthorisationTestConstants.GENERIC_USER_FAMILY_NAME,
        id: AuthorisationTestConstants.GENERIC_USER_ID,
        isCitizen: GenericTestConstants.FALSE,
      });
    });
  });

  test('should exchange a code for a token and decode a JWT to get the citizen user details', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
        id_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
      },
    });

    const result = await getUserDetails(
      AuthorisationTestConstants.URL_LOCALHOST,
      AuthorisationTestConstants.RAW_CODE,
      AuthUrls.CALLBACK
    );
    expect(result).toStrictEqual({
      accessToken: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
      email: AuthorisationTestConstants.CITIZEN_USER_EMAIL,
      givenName: AuthorisationTestConstants.CITIZEN_USER_GIVEN_NAME,
      familyName: AuthorisationTestConstants.CITIZEN_USER_FAMILY_NAME,
      id: AuthorisationTestConstants.CITIZEN_USER_ID,
      isCitizen: GenericTestConstants.TRUE,
    });
  });
});
