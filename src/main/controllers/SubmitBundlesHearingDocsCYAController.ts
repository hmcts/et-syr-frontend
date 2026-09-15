import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearBundlesFields } from '../helpers/controller/BundlesPrepareDocsCYAHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('SubmitBundlesHearingDocsCYAController');

export default class SubmitBundlesHearingDocsCYAController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const { userCase } = req.session;
      await getCaseApi(req.session.user?.accessToken).submitBundlesHearingDoc(userCase);
      clearBundlesFields(userCase);
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    return res.redirect(PageUrls.BUNDLES_COMPLETED + getLanguageParam(req.url));
  };
}
