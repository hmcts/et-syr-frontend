import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCyaContent } from '../helpers/controller/RespondToTribunalCYAHelper';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToTribunalCYAController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.CONTACT_TRIBUNAL_CYA, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      ethosCaseReference: req.session.userCase.ethosCaseReference,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      cyaContent: getCyaContent(req, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
        ...req.t(TranslationKeys.CONTACT_TRIBUNAL_CYA, { returnObjects: true }),
      }),
      submitLink: InterceptPaths.RESPOND_TO_TRIBUNAL_SUBMIT + getLanguageParam(req.url),
    });
  };
}