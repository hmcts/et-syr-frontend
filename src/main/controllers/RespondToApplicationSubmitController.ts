import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/RespondToApplicationSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('RespondToApplicationSubmitController');

export default class RespondToApplicationSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    try {
      // Submit response to application
      await getCaseApi(req.session.user?.accessToken).submitRespondentResponseToApplication(userCase);

      // Clear temporary fields
      userCase.ruleCopyState = userCase.copyToOtherPartyYesOrNo && userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTempFields(userCase);

      return res.redirect(PageUrls.RESPOND_TO_APPLICATION_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      logger.error(TseErrors.ERROR_RESPOND_TO_APPLICATION);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
