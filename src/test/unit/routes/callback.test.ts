import axios from 'axios';
import { Application, NextFunction, Response } from 'express';
import redis from 'redis-mock';

import * as authIndex from '../../../main/auth/index';
import { AppRequest, UserDetails } from '../../../main/definitions/appRequest';
import { CallbackTestConstants } from '../../../main/definitions/constants';
import { idamCallbackHandler } from '../../../main/modules/oidc';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
jest.mock('../../../main/auth/index');

const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

const redisClient = redis.createClient();
const serviceUrl = 'serviceUrl';
const existingUser = 'existingUser';
const englishGuidParam = '-en';
const welshGuidParam = '-cy';

describe('Test responds to /oauth2/callback', function () {
  let req: AppRequest;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    next = jest.fn();
    req = mockRequest({});
    res = mockResponse();

    req.app = {} as Application;
    req.app.locals = {};
    req.app.locals.redisClient = redisClient;
    req.query = {};

    const getUserDetailsMock = authIndex.getUserDetails as jest.MockedFunction<
      (serviceUrl: string, rawCode: string, callbackUrlPageLink: string) => Promise<UserDetails>
    >;
    getUserDetailsMock.mockReturnValue(Promise.resolve(mockUserDetails as UserDetails));

    jest.spyOn(res, 'redirect');
  });

  afterAll(() => {
    redisClient.quit();
  });

  test('Should redirect to Claimant applications page in English language if an existing user who had selected English logs in', async () => {
    req.query = { code: 'testCode', state: existingUser + englishGuidParam };

    await expect(idamCallbackHandler(req, res, next, serviceUrl)).rejects.toThrow(CallbackTestConstants.REDIS_ERROR);
  });

  test('Should redirect to Claimant applications page in Welsh language if an existing user who had selected Welsh logs in', async () => {
    req.query = { code: 'testCode', state: existingUser + welshGuidParam };

    await expect(idamCallbackHandler(req, res, next, serviceUrl)).rejects.toThrow(CallbackTestConstants.REDIS_ERROR);
  });
});
