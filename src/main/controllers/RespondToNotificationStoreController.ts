import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/RespondToNotificationSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('RespondToNotificationStoreController');

export default class RespondToNotificationStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { user, userCase } = req.session;
    const languageParam = getLanguageParam(req.url);

    try {
      // store application
      await getCaseApi(user?.accessToken).storeResponseToNotification(userCase, user);

      // Update notification respondent state
      await getCaseApi(user.accessToken).changeNotificationStatus(
        userCase,
        user,
        userCase.selectedNotification,
        LinkStatus.STORED
      );

      // clear temporary fields
      const notificationId = userCase.selectedNotification.id;
      clearTempFields(userCase);

      // redirect next page
      return res.redirect(
        PageUrls.RESPOND_TO_NOTIFICATION_STORE_CONFIRMATION.replace(':itemId', notificationId) + languageParam
      );
    } catch (error) {
      logger.error(TseErrors.ERROR_RESPOND_TO_NOTIFICATION + error);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }
  };
}
