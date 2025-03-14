import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, TseErrors } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { clearTempFields, getLatestApplication } from '../helpers/controller/ContactTribunalHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';

const logger = getLogger('ContactTribunalSubmitController');

export default class ContactTribunalSubmitController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      // Submit application
      await getCaseApi(req.session.user?.accessToken).submitRespondentTse(req);

      // Clear temporary fields
      const ruleCopyState = req.session.userCase.copyToOtherPartyYesOrNo === YesOrNo.YES;
      clearTempFields(req.session.userCase);

      // Update et3CaseDetailsLinksStatuses
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.YourRequestsAndApplications,
        LinkStatus.IN_PROGRESS
      );

      // Update application status
      const latestApplication = getLatestApplication(
        req.session?.userCase?.genericTseApplicationCollection,
        req.session?.user
      );
      await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(
        req,
        latestApplication,
        LinkStatus.IN_PROGRESS
      );

      req.session.userCase.ruleCopyState = ruleCopyState;
      return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + getLanguageParam(req.url));
    } catch (error) {
      logger.error(TseErrors.ERROR_SUBMIT_APPLICATION);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
