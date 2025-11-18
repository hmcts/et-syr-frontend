import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/RespondToNotificationSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('RespondToNotificationSubmitController');

export default class RespondToNotificationSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase, user } = req.session;
    const languageParam = getLanguageParam(req.url);

    try {
      // Submit response to notification
      await getCaseApi(user.accessToken).submitResponseToNotification(userCase, user);

      // Clear temporary fields
      clearTempFields(userCase);

      return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE + languageParam);
    } catch (error) {
      logger.error(TseErrors.ERROR_RESPOND_TO_NOTIFICATION + error);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }
  };
}
