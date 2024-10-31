import { randomUUID } from 'crypto';

import redis from 'redis-mock';

import { CaseDataCacheKey, CaseType, YesOrNo } from '../../../main/definitions/case';
import { CacheErrors, PageUrls, RedisErrors } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import {
  cachePreLoginCaseData,
  generatePreLoginUrl,
  getPreloginCaseData,
  setPreLoginUrl,
} from '../../../main/services/CacheService';
import { mockApp } from '../mocks/mockApp';
import { mockRequest } from '../mocks/mockRequest';

const redisClient = redis.createClient();
const uuid = 'f0d62bc6-5c7b-4ac1-98d2-c745a2df79b8';
const cacheMap = new Map<CaseDataCacheKey, string>([
  [CaseDataCacheKey.CLAIMANT_REPRESENTED, YesOrNo.YES],
  [CaseDataCacheKey.CASE_TYPE, CaseType.SINGLE],
  [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
]);

const guid = '7e7dfe56-b16d-43da-8bc4-5feeef9c3d68';

jest.mock('crypto');
const mockedRandomUUID = randomUUID as jest.Mock<string>;

afterAll(() => {
  redisClient.quit();
});

describe('Get pre-login case data from Redis', () => {
  it('should return case data if it is stored in Redis with the guid provided', async () => {
    redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
    const caseData = await getPreloginCaseData(redisClient, guid);
    const userDataMap: Map<CaseDataCacheKey, string> = new Map(JSON.parse(caseData));

    expect(userDataMap.get(CaseDataCacheKey.CASE_TYPE)).toEqual('Single');
    expect(userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED)).toEqual('Yes');
  });

  it('should throw error if case data does not exist in Redis with the guid provided', async () => {
    redisClient.flushdb();
    const error = new Error(RedisErrors.REDIS_ERROR);
    error.name = RedisErrors.FAILED_TO_RETRIEVE;
    await expect(getPreloginCaseData(redisClient, guid)).rejects.toEqual(error);
  });
});

describe('Cache Types of Claim to Redis', () => {
  it('should generate an uuid and store it in Redis', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');

    cachePreLoginCaseData(redisClient, cacheMap);
    expect(redisClient.set).toHaveBeenCalledWith(uuid, JSON.stringify(Array.from(cacheMap.entries())));
  });

  it('should return an uuid', () => {
    mockedRandomUUID.mockImplementation(() => uuid);
    jest.spyOn(redisClient, 'set');
    jest.spyOn(redisClient, 'set');

    expect(cachePreLoginCaseData(redisClient, cacheMap)).toBe(uuid);
  });
});

describe('Generate pre login url', () => {
  const host: string = 'localhost';
  const port: string = ':8080';
  const url: string = '/test-url';
  const expectedPreLoginUrl = 'https://localhost:8080/test-url';
  it('should generate pre login url', () => {
    expect(generatePreLoginUrl(host, port, url, undefined)).toEqual(expectedPreLoginUrl);
  });

  it('should throw error when host is empty', async () => {
    let caughtError;
    try {
      generatePreLoginUrl(undefined, port, url, true);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toEqual(new Error(CacheErrors.ERROR_HOST_NOT_FOUND_FOR_PRE_LOGIN_URL));
  });

  it('should throw error when port is empty', async () => {
    let caughtError;
    try {
      generatePreLoginUrl(host, undefined, url, true);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toEqual(new Error(CacheErrors.ERROR_PORT_NOT_FOUND_FOR_PRE_LOGIN_URL));
  });

  it('should not throw error when port is empty but not development mode', async () => {
    let caughtError;
    try {
      generatePreLoginUrl(host, undefined, url, false);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toEqual(undefined);
  });

  it('should throw error when url is empty', async () => {
    let caughtError;
    try {
      generatePreLoginUrl(host, port, undefined, undefined);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toEqual(new Error(CacheErrors.ERROR_URL_NOT_FOUND_FOR_PRE_LOGIN_URL));
  });
  describe('setPreLoginUrl', () => {
    it('should set pre login url to redis', () => {
      mockedRandomUUID.mockImplementation(() => uuid);
      const request = mockRequest({});
      request.app = mockApp({});
      request.app.locals = { redisClient };
      setPreLoginUrl(request, PageUrls.CASE_LIST);
      expect(request.session.guid).toEqual(uuid);
    });
  });
});
