import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { returnTodayPlus7 } from '../helpers/DateHelper';
import UrlUtils from '../utils/UrlUtils';

export default class ContactTribunalSubmitCompleteController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_COMPLETE, { returnObjects: true }),
      todayPlus7: returnTodayPlus7(req.url),
      ruleCopystate: req.session?.userCase.ruleCopystate,
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
