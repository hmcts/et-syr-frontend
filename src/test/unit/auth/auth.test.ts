import * as process from 'node:process';

import axios from 'axios';
import config from 'config';

import { getRedirectUrl, getUserDetails } from '../../../main/auth';
import { AuthUrls, GenericTestConstants, languages } from '../../../main/definitions/constants';

const AuthorisationTestConstants = {
  AUTHORISATION_URL_CONFIGURATION_NAME: 'services.idam.authorizationURL',
  GUID: '4e3cac74-d8cf-4de9-ad20-cf6248ba99aa',
  URL_LOCALHOST: 'http://localhost',
  AXIOS_MODULE_NAME: 'axios',
  RAW_CODE: '123',
  GENERIC_USER_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ',
  GENERIC_USER_EMAIL: 'test@test.com',
  GENERIC_USER_GIVEN_NAME: 'John',
  GENERIC_USER_FAMILY_NAME: 'Dorian',
  GENERIC_USER_ID: '123',
  CITIZEN_USER_TOKEN:
    'eyJ0eXAiOiJKV1QiLCJraWQiOiIxZXIwV1J3Z0lPVEFGb2pFNHJDL2ZiZUt1M0k9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiajIyZzNtZ1BEUkpIMDRDU0laTnBJZyIsInN1YiI6ImNpdGl6ZW4tdXNlckB0ZXN0LmNvLnVrIiwiYXVkaXRUcmFja2luZ0lkIjoiZjM0ZTZjOWMtZmRmYi00NDRmLWFjNjYtZWQxZmQ2NjAxZWIzLTQ2MjU0MDEwIiwicm9sZXMiOlsiY2l0aXplbiIsImNhc2V3b3JrZXItZW1wbG95bWVudC1hcGkiLCJjYXNld29ya2VyLWVtcGxveW1lbnQiLCJjYXNld29ya2VyLWVtcGxveW1lbnQtZW5nbGFuZHdhbGVzIiwiY2FzZXdvcmtlciJdLCJpc3MiOiJodHRwczovL2Zvcmdlcm9jay1hbS5zZXJ2aWNlLmNvcmUtY29tcHV0ZS1pZGFtLWFhdDIuaW50ZXJuYWw6ODQ0My9vcGVuYW0vb2F1dGgyL3JlYWxtcy9yb290L3JlYWxtcy9obWN0cyIsInRva2VuTmFtZSI6ImlkX3Rva2VuIiwiZ2l2ZW5fbmFtZSI6IkNpdGl6ZW4iLCJhdWQiOiJobWN0cyIsInVpZCI6ImE0Mzk2YjEwLTY5MjgtNDcxMS1hM2JhLTg5ZmNmNmFkYjc3OSIsImF6cCI6ImhtY3RzIiwiYXV0aF90aW1lIjoxNjUzNDkyMzkzLCJuYW1lIjoiQ2l0aXplbiBUZXN0ZXIiLCJyZWFsbSI6Ii9obWN0cyIsImV4cCI6MTY1MzQ5NTk5MywidG9rZW5UeXBlIjoiSldUVG9rZW4iLCJpYXQiOjE2NTM0OTIzOTMsImZhbWlseV9uYW1lIjoiVGVzdGVyIn0.KTfxz0oMqSqwRkcPczZISwp5hOP_RLcopqu9mOIdARg1TiZhzEnueo8_ppSrzb6YZRLmhO65K-hsqjBX1gE_oSN_975i5mfE3gBd1B_vCvEtS3YFLc_ReLiSTRW9Y0AelPzKOMqW2E0yFU_1IdCBrq3-rtQK2e1sAD8vVOIRF9ooih9mi3vUnD6kevDj099u_aE7qy_ueClt37CWhQ1achOxb11EeVYjv4K48TG1TxiBtIJx2H2b5lZayQuAPd8Jn4SEXXLCvhbt5K61L7NFZh0UiNfRjySwfIPX9MIovUPsGvnK4zJ6a4fqJU0SIl6v5wN5WMXp0u1YUzx7fzIoww',
  CITIZEN_USER_EMAIL: 'citizen-user@test.co.uk',
  CITIZEN_USER_GIVEN_NAME: 'Citizen',
  CITIZEN_USER_FAMILY_NAME: 'Tester',
  CITIZEN_USER_ID: 'a4396b10-6928-4711-a3ba-89fcf6adb779',
  CITIZEN_USER_ROLE_AS_LIST: ['citizen'],
} as const;

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

  test('should get userinfo when environment is development', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
        id_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
      },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            uid: AuthorisationTestConstants.CITIZEN_USER_ID,
            roles: AuthorisationTestConstants.CITIZEN_USER_ROLE_AS_LIST,
            sub: AuthorisationTestConstants.CITIZEN_USER_EMAIL,
            family_name: AuthorisationTestConstants.CITIZEN_USER_FAMILY_NAME,
            given_name: AuthorisationTestConstants.CITIZEN_USER_GIVEN_NAME,
          }),
        ok: true,
        status: 200,
      })
    ) as jest.Mock;
    process.env.NODE_ENV = 'development';
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
  test('should not get userinfo when not fetch', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
        id_token: AuthorisationTestConstants.CITIZEN_USER_TOKEN,
      },
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            nothing: 'found',
          }),
        ok: false,
        status: 400,
      })
    ) as jest.Mock;
    process.env.NODE_ENV = 'development';
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
