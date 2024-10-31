import config from 'config';
import { Application, NextFunction, Response } from 'express';

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
import { cachePreLoginUrl, generatePreLoginUrl, getPreLoginUrl, setPreLoginUrl } from '../../services/CacheService';
import ErrorUtils from '../../utils/ErrorUtils';

import { validateNoSignInEndpoints } from './noSignInRequiredEndpoints';

const logger = getLogger('oidc');

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string => `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(PageUrls.CASE_DETAILS_WITH_CASE_ID_PARAMETER, (req: AppRequest, res: Response, next: NextFunction) => {
      const redisClient = req.app.locals?.redisClient;
      if (!redisClient) {
        logger.error('Unable to connect to Redis');
        return ErrorUtils.throwManualError(RedisErrors.CLIENT_NOT_FOUND, RedisErrors.FAILED_TO_CONNECT);
      } else {
        try {
          const preLoginUrl = generatePreLoginUrl(res.locals.host, port, req.url, app.locals.developmentMode);
          req.session.guid = cachePreLoginUrl(redisClient, preLoginUrl);
        } catch (err) {
          logger.error('Unable to cache pre login URL' + err.message);
          return ErrorUtils.throwError(err, RedisErrors.FAILED_TO_SAVE);
        }
      }
      if (!req.session.user?.isCitizen) {
        return res.redirect(AuthUrls.LOGIN);
      }
      return next();
    });

    app.get(PageUrls.CHECKLIST, (req: AppRequest, res: Response, next: NextFunction) => {
      setPreLoginUrl(req, PageUrls.CHECKLIST);
      return next();
    });

    app.get(PageUrls.CASE_LIST, (req: AppRequest, res: Response, next: NextFunction) => {
      setPreLoginUrl(req, PageUrls.CASE_LIST);
      return next();
    });

    app.get(AuthUrls.LOGIN, (req: AppRequest, res) => {
      let stateParam;
      const languageParam = req.cookies.i18next === languages.WELSH ? languages.WELSH : languages.ENGLISH;
      req.session.guid ? (stateParam = req.session.guid) : (stateParam = EXISTING_USER);
      req.session.caseNumberChecked = false;
      stateParam = stateParam + '-' + languageParam;
      res.redirect(getRedirectUrl(serviceUrl(res), AuthUrls.CALLBACK, stateParam, languageParam));
    });

    app.get(AuthUrls.LOGOUT, (req: AppRequest, res: Response) => {
      req.session.destroy(err => {
        if (err) {
          logger.error(SessionErrors.ERROR_DESTROYING_SESSION);
        }
        return res.redirect(PageUrls.HOME);
      });
    });

    app.get(AuthUrls.CALLBACK, (req: AppRequest, res: Response) => {
      idamCallbackHandler(req, res, serviceUrl(res)).then();
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

export const idamCallbackHandler = async (req: AppRequest, res: Response, serviceUrl: string): Promise<void> => {
  const redisClient = req.app.locals?.redisClient;
  if (!redisClient) {
    return ErrorUtils.throwManualError(RedisErrors.CLIENT_NOT_FOUND, RedisErrors.FAILED_TO_CONNECT);
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
    logger.error(RedisErrors.FAILED_TO_RETRIEVE_PRE_LOGIN_URL);
  }
};
