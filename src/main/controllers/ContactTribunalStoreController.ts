import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { LoadUserCaseResults, loadUserCaseFromApi } from '../helpers/LoadUserCaseHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getYourStoredApplicationList } from '../helpers/StoredApplicationHelper';
import { clearTempFields } from '../helpers/controller/ContactTribunalSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';
import { RespondentUtils } from '../utils/RespondentUtils';

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
      const loadResult = await loadUserCaseFromApi(
        req,
        res,
        req.session.userCase.id,
        RespondentUtils.findSelectedRespondentByRequest(req)?.ccdId
      );

      if (loadResult === LoadUserCaseResults.TRANSFERRED) {
        return;
      }

      if (loadResult === LoadUserCaseResults.FAILED) {
        return res.redirect(ErrorPages.NOT_FOUND + languageParam);
      }

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
