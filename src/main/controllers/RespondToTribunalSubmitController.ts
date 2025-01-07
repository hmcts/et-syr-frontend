import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';

export default class RespondToTribunalSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Update Hub Links Statuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.RespondentRequestsAndApplications,
        LinkStatus.IN_PROGRESS
      );

      // Submit application
      // TODO: save data in api

      // Clear temporary fields
      // TODO

      return res.redirect(PageUrls.RESPOND_TO_TRIBUNAL_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
