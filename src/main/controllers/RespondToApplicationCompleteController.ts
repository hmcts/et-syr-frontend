import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToApplicationCompleteController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_APPLICATION_COMPLETE, { returnObjects: true }),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
      rule90state: req.session?.userCase?.rule90state,
    });
  };
}
