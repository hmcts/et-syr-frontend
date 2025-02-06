import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields } from '../helpers/controller/ContactTribunalHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';

const logger = getLogger('SubmitContactTribunalController');

export default class ContactTribunalSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Update Hub Links Statuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.RespondentRequestsAndApplications,
        LinkStatus.IN_PROGRESS
      );

      // Submit application
      //TODO: save data in api
      await getCaseApi(req.session.user?.accessToken).submitRespondentTse(req, logger);
      // Clear temporary fields
      clearTempFields(req.session.userCase);
      logger.info('Contact Tribunal submitted successfully');
      // Redirect to the complete page
      return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
