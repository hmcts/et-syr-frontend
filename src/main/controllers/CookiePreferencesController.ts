import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class CookiePreferencesController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.COOKIE_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COOKIE_PREFERENCES as never, { returnObjects: true } as never),
      PageUrls,
    });
  };
}
