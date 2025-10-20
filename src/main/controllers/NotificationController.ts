import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getNotificationTable } from '../helpers/controller/NotificationControllerHelper';

export default class NotificationController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    res.render(TranslationKeys.NOTIFICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      notificationList: getNotificationTable(req),
    });
  };
}
