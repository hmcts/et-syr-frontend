import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, TranslationKeys, TseErrors } from '../definitions/constants';
import { findSelectedSendNotification, getNotificationDetailsUrl } from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('RespondToNotificationStoreConfirmController');

export default class RespondToNotificationStoreConfirmController {
  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;
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

    // render page
    res.render(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, { returnObjects: true }),
      viewCorrespondenceLink: getNotificationDetailsUrl(selectedNotification) + languageParam,
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
