import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors, languages } from '../definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { returnValidUrlWithPathParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/RespondToNotificationSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('RespondToNotificationStoreController');

export default class RespondToNotificationStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { user, userCase } = req.session;
    const languageParam = req.url?.includes(languages.WELSH_URL_POSTFIX)
      ? languages.WELSH_URL_PARAMETER
      : languages.ENGLISH_URL_PARAMETER;

    try {
      // store application
      await getCaseApi(user?.accessToken).storeResponseToNotification(userCase, user);

      // clear temporary fields
      const notificationId = userCase.selectedNotification.id;
      clearTempFields(userCase);

      // refresh userCase from api
      req.session.userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(user?.accessToken).getUserCase(userCase.id)).data,
        req
      );

      // redirect next page
      return res.redirect(
        returnValidUrlWithPathParam(
          PageUrls.RESPOND_TO_NOTIFICATION_STORE_CONFIRMATION,
          'itemId',
          notificationId,
          languageParam
        )
      );
    } catch (error) {
      logger.error(TseErrors.ERROR_RESPOND_TO_NOTIFICATION + error);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }
  };
}
