import config from 'config';
import { Application, NextFunction, Request, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../auth';
import { AppRequest } from '../../definitions/appRequest';
import {
  AuthUrls,
  EXISTING_USER,
  HTTPS_PROTOCOL,
  PageUrls,
  RedisErrors,
  SessionErrors,
  languages,
} from '../../definitions/constants';
import { getLogger } from '../../logger';
import { cachePreLoginUrl, getPreLoginUrl } from '../../services/CacheService';
import ErrorUtil from '../../utils/errorUtil';

import { validateNoSignInEndpoints } from './noSignInRequiredEndpoints';

const logger = getLogger('oidc');

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string => `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(PageUrls.RESPONSE_HUB, (req: AppRequest, res: Response, next: NextFunction) => {
      const redisClient = req.app.locals?.redisClient;
      if (!redisClient) {
        return ErrorUtil.throwManuelError(RedisErrors.CLIENT_NOT_FOUND, RedisErrors.FAILED_TO_CONNECT);
      } else {
        try {
          const preLoginUrl = HTTPS_PROTOCOL + res.locals.host + port + req.url;
          req.session.guid = cachePreLoginUrl(redisClient, preLoginUrl);
        } catch (err) {
          return ErrorUtil.throwError(err, RedisErrors.FAILED_TO_SAVE);
        }
      }
      if (!req.session.user?.isCitizen) {
        return res.redirect(AuthUrls.LOGIN);
      }
      return next();
    });

    app.get(AuthUrls.LOGIN, (req: AppRequest, res) => {
      let stateParam;
      const languageParam = req.cookies.i18next === languages.WELSH ? languages.WELSH : languages.ENGLISH;
      req.session.guid ? (stateParam = req.session.guid) : (stateParam = EXISTING_USER);
      stateParam = stateParam + '-' + languageParam;
      res.redirect(getRedirectUrl(serviceUrl(res), AuthUrls.CALLBACK, stateParam, languageParam));
    });

    app.get(AuthUrls.LOGOUT, (req: AppRequest, res: Response) => {
      const guid = req.session.guid;
      req.session.destroy(err => {
        if (err) {
          logger.error(SessionErrors.ERROR_DESTROYING_SESSION);
        }
        return handleRedirectUrl(req, res, guid);
      });
    });

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response, next: NextFunction) => {
      idamCallbackHandler(req, res, next, serviceUrl(res)).then();
    });

    app.use(async (req: AppRequest, res: Response, next: NextFunction) => {
      if (req.session?.user) {
        // a nunjucks global variable 'isLoggedIn' has been created for the views
        // it is assigned the value of res.locals.isLoggedIn
        res.locals.isLoggedIn = true;
        next();
      } else if (validateNoSignInEndpoints(req.url) || process.env.IN_TEST || '/extend-session' === req.url) {
        next();
      } else {
        return res.redirect(AuthUrls.LOGIN);
      }
    });
  }
}

async function handleRedirectUrl(req: Request, res: Response, guid: string) {
  try {
    const redisClient = req.app.locals?.redisClient;
    if (redisClient) {
      const preLoginUrl = await getPreLoginUrl(redisClient, guid);
      if (preLoginUrl) {
        return res.redirect(preLoginUrl);
      }
    }
  } catch (err) {
    return ErrorUtil.throwError(err, RedisErrors.FAILED_TO_RETRIEVE);
  }
}

export const idamCallbackHandler = async (
  req: AppRequest,
  res: Response,
  next: NextFunction,
  serviceUrl: string
): Promise<void> => {
  const redisClient = req.app.locals?.redisClient;
  if (!redisClient) {
    return ErrorUtil.throwManuelError(RedisErrors.CLIENT_NOT_FOUND, RedisErrors.FAILED_TO_CONNECT);
  }
  if (typeof req.query.code === 'string' && typeof req.query.state === 'string') {
    req.session.user = await getUserDetails(serviceUrl, req.query.code, AuthUrls.CALLBACK);
    req.session.save();
  } else {
    return res.redirect(AuthUrls.LOGIN);
  }
  // If user account does not have the citizen role redirect to login page
  if (!req.session.user?.isCitizen) {
    return res.redirect(AuthUrls.LOGIN);
  }
  const state = String(req.query?.state);
  const guid = state.substring(0, state.lastIndexOf('-'));

  try {
    const preLoginUrl = await getPreLoginUrl(redisClient, guid);
    if (preLoginUrl) {
      return res.redirect(preLoginUrl);
    }
    logger.error(RedisErrors.FAILED_TO_RETRIEVE_PRE_LOGIN_URL);
  } catch (err) {
    ErrorUtil.throwError(err, RedisErrors.FAILED_TO_RETRIEVE_PRE_LOGIN_URL);
  }
};