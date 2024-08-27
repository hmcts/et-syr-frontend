import { randomUUID } from 'crypto';

import { RedisClient } from 'redis';

import { CaseDataCacheKey } from '../definitions/case';
import { CacheErrors, HTTPS_PROTOCOL, RedisErrors } from '../definitions/constants';
import StringUtils from '../utils/StringUtils';

export const generatePreLoginUrl = (host: string, port: string, url: string): string => {
  if (StringUtils.isBlank(host)) {
    throw new Error(CacheErrors.ERROR_HOST_NOT_FOUND_FOR_PRE_LOGIN_URL);
  }
  if (StringUtils.isBlank(port)) {
    throw new Error(CacheErrors.ERROR_PORT_NOT_FOUND_FOR_PRE_LOGIN_URL);
  }
  if (StringUtils.isBlank(url)) {
    throw new Error(CacheErrors.ERROR_URL_NOT_FOUND_FOR_PRE_LOGIN_URL);
  }
  return HTTPS_PROTOCOL + host + port + url;
};

export const cachePreLoginUrl = (redisClient: RedisClient, preLoginUrl: string): string => {
  const guid = randomUUID();
  redisClient.set(guid, preLoginUrl);
  return guid;
};

export const cachePreLoginCaseData = (redisClient: RedisClient, cacheMap: Map<CaseDataCacheKey, string>): string => {
  const guid = randomUUID();
  redisClient.set(guid, JSON.stringify(Array.from(cacheMap.entries())));
  return guid;
};

export const getPreLoginUrl = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, preLoginUrl: string) => {
      if (err || !preLoginUrl) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETRIEVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
      resolve(preLoginUrl);
    });
  });
};

export const getPreloginCaseData = (redisClient: RedisClient, guid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    redisClient.get(guid, (err: Error, userData: string) => {
      if (err || !userData) {
        const error = new Error(err ? err.message : RedisErrors.REDIS_ERROR);
        error.name = RedisErrors.FAILED_TO_RETRIEVE;
        if (err?.stack) {
          error.stack = err.stack;
        }
        reject(error);
      }
      resolve(userData);
    });
  });
};
