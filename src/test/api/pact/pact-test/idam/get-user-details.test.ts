import * as path from 'path';

import { pactWith } from 'jest-pact';

import { IdTokenJwtPayload } from '../../../../../main/auth';
import { idamGetUserDetails } from '../../pactUtil';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
pactWith(
  {
    consumer: 'et-syr',
    provider: 'Idam_api',
    port: 8000,
    log: path.resolve(process.cwd(), 'src/test/api/pact/pacts/logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'src/test/api/pact/pacts'),
    spec: 2,
    pactfileWriteMode: 'merge',
  },
  provider => {
    describe('IDAM Service simulation', () => {
      const RESPONSE_BODY = {
        uid: somethingLike('abc123'),
        given_name: somethingLike('Joe'),
        family_name: somethingLike('Bloggs'),
        sub: somethingLike('joe.bloggs@hmcts.net'),
        roles: somethingLike([somethingLike('solicitor'), somethingLike('caseworker')]),
      };

      beforeEach(async () => {
        await provider.addInteraction({
          state: 'valid user exists',
          uponReceiving: 'request for that user',
          withRequest: {
            method: 'GET',
            path: '/details',
            headers: {
              Authorization: 'Bearer some-access-token',
            },
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: RESPONSE_BODY,
          },
        });
      });

      test('Returns the user details from IDAM', async () => {
        const taskUrl = `${provider.mockService.baseUrl}/details`;
        const axiosResponse = await idamGetUserDetails(taskUrl);
        const dto: IdTokenJwtPayload = axiosResponse.data;
        assertResponses(dto);
      });
    });
  }
);

function assertResponses(dto: IdTokenJwtPayload) {
  expect(dto.uid).toStrictEqual('abc123');
  expect(dto.sub).toStrictEqual('joe.bloggs@hmcts.net');
  expect(dto.given_name).toStrictEqual('Joe');
  expect(dto.family_name).toStrictEqual('Bloggs');
  expect(dto.roles[0]).toStrictEqual('solicitor');
  expect(dto.roles[1]).toStrictEqual('caseworker');
}
