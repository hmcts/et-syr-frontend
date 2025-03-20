import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCyaContent } from '../helpers/controller/RespondToApplicationCYAHelper';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToApplicationCYAController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.RESPOND_TO_APPLICATION_CYA, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_APPLICATION_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      cyaContent: getCyaContent(req),
      submitLink: InterceptPaths.RESPOND_TO_APPLICATION_SUBMIT + getLanguageParam(req.url),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
