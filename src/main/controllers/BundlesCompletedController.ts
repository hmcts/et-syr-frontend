import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import UrlUtils from '../utils/UrlUtils';

export default class BundlesCompletedController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.BUNDLES_COMPLETED, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.BUNDLES_COMPLETED as never, { returnObjects: true } as never),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
      hideContactUs: true,
    });
  }
}
