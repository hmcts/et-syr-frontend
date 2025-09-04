import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getYourStoredApplicationList } from '../helpers/StoredApplicationHelper';
import { clearTempFields } from '../helpers/controller/ContactTribunalSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';

const logger = getLogger('ContactTribunalStoreController');

export default class ContactTribunalStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    try {
      // store application
      await getCaseApi(req.session.user?.accessToken).storeRespondentTse(req);

      // clear temporary fields
      clearTempFields(req.session.userCase);

      // update et3CaseDetailsLinksStatuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.YourRequestsAndApplications,
        LinkStatus.STORED
      );

      // refresh userCase from api
      req.session.userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data,
        req
      );

      // get latest stored application id
      const storedApps = getYourStoredApplicationList(req);
      const latestStoredAppId = storedApps?.length > 0 ? storedApps[storedApps.length - 1].id : undefined;

      // redirect next page
      return res.redirect(
        PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE.replace(':appId', latestStoredAppId) + languageParam
      );
    } catch (error) {
      logger.error(TseErrors.ERROR_STORE_APPLICATION);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }
  };
}
