import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/ContactTribunalHelper';
import { getCaseApi } from '../services/CaseService';

export default class ContactTribunalSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    try {
      // Update Hub Links Statuses
      // TODO: update Application status
      userCase.et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.YourRequestsAndApplications] =
        LinkStatus.IN_PROGRESS;

      // Submit application
      await getCaseApi(req.session.user?.accessToken).submitRespondentTse(req);

      // Clear temporary fields
      userCase.ruleCopystate = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTempFields(req.session.userCase);

      return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
