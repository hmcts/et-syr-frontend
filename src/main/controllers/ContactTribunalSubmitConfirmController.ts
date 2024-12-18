import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import UrlUtils from '../utils/UrlUtils';

export default class ContactTribunalSubmitConfirmController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_CONFIRMATION, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_CONFIRMATION, { returnObjects: true }),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  }
}
