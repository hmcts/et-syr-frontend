import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { loadUserCaseFromApi } from '../helpers/CaseTransferHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getNotificationTable } from '../helpers/controller/NotificationControllerHelper';
import { RespondentUtils } from '../utils/RespondentUtils';

export default class NotificationController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const loadResult = await loadUserCaseFromApi(
      req,
      res,
      req.session.userCase.id,
      RespondentUtils.findSelectedRespondentByRequest(req)?.ccdId
    );

    if (loadResult === 'transferred') {
      return;
    }

    if (loadResult === 'failed') {
      return res.redirect(PageUrls.NOT_FOUND + getLanguageParam(req.url));
    }

    res.render(TranslationKeys.NOTIFICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      notificationList: getNotificationTable(req),
    });
  };
}
