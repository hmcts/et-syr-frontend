import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, TranslationKeys, TseErrors } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';
import { findSelectedSendNotification } from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getNotificationContent,
  getNotificationStatusAfterViewed,
} from '../helpers/controller/NotificationDetailsControllerHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('NotificationDetailsController');

export default class NotificationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase, user } = req.session;
    const languageParam = getLanguageParam(req.url);

    // Find the selected notification
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // Update the notification status as viewed
    try {
      const newStatus: LinkStatus = getNotificationStatusAfterViewed(selectedNotification.value, user);
      if (newStatus) {
        await getCaseApi(user?.accessToken).changeNotificationStatus(req, selectedNotification, newStatus);
      }
    } catch (error) {
      logger.error(TseErrors.ERROR_UPDATE_LINK_STATUS);
      res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    res.render(TranslationKeys.NOTIFICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      notificationContent: getNotificationContent(selectedNotification.value, req),
    });
  };
}
