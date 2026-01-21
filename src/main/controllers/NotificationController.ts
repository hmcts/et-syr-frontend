import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getNotificationTable } from '../helpers/controller/NotificationControllerHelper';
import { getCaseApi } from '../services/CaseService';

export default class NotificationController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    // refresh userCase from api
    req.session.userCase = formatApiCaseDataToCaseWithId(
      (await getCaseApi(req.session.user.accessToken).getUserCase(req.session.userCase.id)).data,
      req
    );

    res.render(TranslationKeys.NOTIFICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      notificationList: getNotificationTable(req),
    });
  };
}
