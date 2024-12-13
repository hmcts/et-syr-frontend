import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import UrlUtils from '../utils/UrlUtils';

export default class HoldingPageController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.HOLDING_PAGE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HOLDING_PAGE, { returnObjects: true }),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  }
}
