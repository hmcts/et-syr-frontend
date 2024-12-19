import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/ContactTribunalHelper';
import ET3Util from '../utils/ET3Util';

export default class ContactTribunalStoreController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Update Hub Links Statuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.RespondentRequestsAndApplications,
        LinkStatus.STORED
      );

      // Store application
      // TODO: save data in api

      // Clear temporary fields
      clearTempFields(req.session.userCase);

      return res.redirect(PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
