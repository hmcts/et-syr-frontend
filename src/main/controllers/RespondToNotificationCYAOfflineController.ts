import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getNotificationCyaContent } from '../helpers/controller/RespondToNotificationCYAHelper';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToNotificationCYAOfflineController {
  public get = (req: AppRequest, res: Response): void => {
    res.render(TranslationKeys.RESPOND_TO_NOTIFICATION_CYA_OFFLINE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPOND_TO_NOTIFICATION_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      cyaContent: getNotificationCyaContent(req),
      storeLink: InterceptPaths.RESPOND_TO_NOTIFICATION_STORE + getLanguageParam(req.url),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
