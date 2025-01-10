import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCyaContent } from '../helpers/controller/RespondToTribunalHelper';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToTribunalCYAController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_CYA, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_TRIBUNAL_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      cyaContent: getCyaContent(req, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.RESPOND_TO_TRIBUNAL_CYA, { returnObjects: true }),
      }),
      submitLink: InterceptPaths.RESPOND_TO_TRIBUNAL_SUBMIT + getLanguageParam(req.url),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
