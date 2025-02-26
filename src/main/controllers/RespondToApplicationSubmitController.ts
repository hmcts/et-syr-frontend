import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/RespondToApplicationSubmitHelper';
import { getCaseApi } from '../services/CaseService';

export default class RespondToApplicationSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    try {
      // Update Hub Links Statuses
      // TODO: update Statuses

      // Submit response to application
      await getCaseApi(req.session.user?.accessToken).submitRespondentResponseToApplication(userCase);

      // Clear temporary fields
      userCase.ruleCopystate = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTempFields(userCase);

      return res.redirect(PageUrls.RESPOND_TO_APPLICATION_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
