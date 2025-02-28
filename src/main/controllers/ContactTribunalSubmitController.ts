import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/ContactTribunalHelper';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';

export default class ContactTribunalSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Submit application
      await getCaseApi(req.session.user?.accessToken).submitRespondentTse(req);

      // Clear temporary fields
      const ruleCopyState = req.session.userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTempFields(req.session.userCase);

      // Update Hub Links Statuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.YourRequestsAndApplications,
        LinkStatus.IN_PROGRESS
      );

      req.session.userCase.ruleCopyState = ruleCopyState;
      return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
