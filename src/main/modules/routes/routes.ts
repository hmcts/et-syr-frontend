import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import HomeController from '../../controllers/HomeController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import ResponseHubController from '../../controllers/ResponseHubController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import { PageUrls, Urls } from '../../definitions/constants';

export class Routes {
  public enableFor(app: Application): void {
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.RESPONSE_HUB, new ResponseHubController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(Urls.EXTEND_SESSION, new SessionTimeoutController().getExtendSession);
    app.get(
      Urls.INFO,
      infoRequestHandler({
        extraBuildInfo: {
          host: os.hostname(),
          name: 'et-syr-frontend',
          uptime: process.uptime(),
        },
        info: {},
      })
    );
  }
}
