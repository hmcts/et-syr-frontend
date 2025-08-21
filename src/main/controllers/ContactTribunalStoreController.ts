import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/ContactTribunalSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';

const logger = getLogger('ContactTribunalStoreController');

export default class ContactTribunalStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Store application
      await getCaseApi(req.session.user?.accessToken).storeRespondentTse(req);

      // Clear temporary fields
      clearTempFields(req.session.userCase);

      // Update et3CaseDetailsLinksStatuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.YourRequestsAndApplications,
        LinkStatus.STORED
      );

      // Redirect next page
      return res.redirect(PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      logger.error(TseErrors.ERROR_STORE_APPLICATION);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
