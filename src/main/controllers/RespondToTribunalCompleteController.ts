import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToTribunalCompleteController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_TRIBUNAL_COMPLETE, { returnObjects: true }),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
      rule91state: req.session?.userCase?.rule91state,
    });
  };
}
